import os
import shutil
src = r'C:\Users\Casper\OneDrive\Desktop\Nova-Aİ'
dst = r'C:\Users\Casper\OneDrive\Desktop\dumansiz-gelecek'
if os.path.exists(dst):
    print('DEST_EXISTS')
    raise SystemExit(1)

ignore = shutil.ignore_patterns('venv', '.git', '*.pyc', '__pycache__')
shutil.copytree(src, dst, ignore=ignore)
print('COPIED')
