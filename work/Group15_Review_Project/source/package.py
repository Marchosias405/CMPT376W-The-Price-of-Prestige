"""Package this project with a file-hash manifest. python source/package.py output.zip"""
from pathlib import Path
import hashlib,sys,zipfile
root=Path(__file__).resolve().parent.parent
target=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else root.parent/'Group15_Review_Package.zip'
assert not target.is_relative_to(root), 'Put the ZIP outside the project to avoid recursive packaging.'
manifest=root/'review/MANIFEST.sha256'
files=sorted(p for p in root.rglob('*') if p.is_file() and p!=manifest and '__pycache__' not in p.parts)
manifest.write_text('\n'.join(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+p.relative_to(root).as_posix() for p in files)+'\n',encoding='utf-8')
target.parent.mkdir(parents=True,exist_ok=True)
with zipfile.ZipFile(target,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for p in files+[manifest]:z.write(p,p.relative_to(root).as_posix())
print(f'{target}: {len(files)+1} files, {target.stat().st_size} bytes')
