import os
src = r'C:\Users\Casper\OneDrive\Desktop\Nova-Aİ'
dst = r'C:\Users\Casper\OneDrive\Desktop\dumansiz-gelecek'
try:
    os.rename(src, dst)
    print('RENAMED')
except Exception as e:
    print('ERROR', type(e).__name__, e)
