import httpx

from fastapi import HTTPException
from urllib.parse import urlparse


GITHUB_API = "https://api.github.com"

# Files that Code Radar should analyze
ALLOWED_EXTENSIONS = {
    ".py", ".js", ".jsx", ".ts", ".tsx",
    ".java", ".cpp", ".c", ".cs",
    ".go", ".php", ".rb", ".sql"
}

# Directories that should be ignored
IGNORED_DIRECTORIES = {
    "node_modules",
    ".git",
    "venv",
    "__pycache__",
    "dist",
    "build",
    ".next"
}

MAX_FILES = 30
MAX_FILE_SIZE = 100_000


def parse_github_url(repo_url: str):

    parsed_url = urlparse(repo_url)

    if parsed_url.hostname not in {
        "github.com",
        "www.github.com"
    }:
        raise HTTPException(
            status_code=400,
            detail="Please provide a valid GitHub repository URL."
        )

    parts = [
        part for part in parsed_url.path.strip("/").split("/")
        if part
    ]

    if len(parts) != 2:
        raise HTTPException(
            status_code=400,
            detail="Invalid repository URL. Expected format: https://github.com/owner/repository"
        )

    owner = parts[0]
    repo = parts[1].removesuffix(".git")

    return owner, repo


async def fetch_repository(repo_url: str):

    owner, repo = parse_github_url(repo_url)

    async with httpx.AsyncClient(
        timeout=30.0,
        follow_redirects=True,
        headers={
            "Accept": "application/vnd.github+json",
            "User-Agent": "Code-Radar"
        }
    ) as client:

        # Step 1: Get repository details
        repo_response = await client.get(
            f"{GITHUB_API}/repos/{owner}/{repo}"
        )

        if repo_response.status_code == 404:
            raise HTTPException(
                status_code=404,
                detail="Repository not found or is private."
            )

        repo_response.raise_for_status()

        repo_data = repo_response.json()

        default_branch = repo_data["default_branch"]

        # Step 2: Get repository file tree
        tree_response = await client.get(
            f"{GITHUB_API}/repos/{owner}/{repo}/git/trees/{default_branch}",
            params={"recursive": "1"}
        )

        tree_response.raise_for_status()

        tree_data = tree_response.json()

        files = []

        # Step 3: Filter source code files
        for item in tree_data.get("tree", []):

            if item.get("type") != "blob":
                continue

            path = item["path"]

            path_parts = path.split("/")

            if any(
                directory in IGNORED_DIRECTORIES
                for directory in path_parts
            ):
                continue

            extension = "." + path.rsplit(".", 1)[-1].lower() \
                if "." in path else ""

            if extension not in ALLOWED_EXTENSIONS:
                continue

            if item.get("size", 0) > MAX_FILE_SIZE:
                continue

            files.append({
                "path": path,
                "url": item["url"],
                "size": item.get("size", 0)
            })

            if len(files) >= MAX_FILES:
                break

        # Step 4: Fetch source code
        repository_files = []

        for file in files:

            content_response = await client.get(
                f"https://raw.githubusercontent.com/{owner}/{repo}/{default_branch}/{file['path']}"
            )

            if content_response.status_code != 200:
                continue

            try:
                content = content_response.content.decode("utf-8")
            except UnicodeDecodeError:
                continue

            repository_files.append({
                "file_path": file["path"],
                "content": content
            })

    return {
        "repository": f"{owner}/{repo}",
        "default_branch": default_branch,
        "total_files": len(repository_files),
        "files": repository_files
    }