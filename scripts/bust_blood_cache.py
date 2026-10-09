from pathlib import Path

files = [
    Path("src/data/lilmed-data.json"),
    Path("src/data/image-overrides.ts"),
]
for path in files:
    text = path.read_text(encoding="utf-8")
    updated = text.replace("/blood-collection/", "/blood-collection/")
    updated = updated.replace(".jpg\"", ".jpg?v=w\"")
    # Revert any non-blood-collection jpg that was touched. These two files
    # only use the ?v=w suffix on blood-collection paths if we replace back
    # every occurrence that is not preceded by blood-collection.
    path.write_text(text, encoding="utf-8")

# Do the replacement only on lines that mention blood-collection.
for path in files:
    lines = path.read_text(encoding="utf-8").splitlines(keepends=True)
    out = []
    changed = 0
    for line in lines:
        if "/blood-collection/" in line and ".jpg" in line and "?v=w" not in line:
            line = line.replace(".jpg", ".jpg?v=w")
            changed += 1
        out.append(line)
    path.write_text("".join(out), encoding="utf-8")
    print(path, changed)
