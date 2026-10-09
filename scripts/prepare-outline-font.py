from pathlib import Path
import sys
sys.path.insert(0, str(Path('.visual-qa/font-tools').resolve()))
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.ttLib.removeOverlaps import removeOverlaps
from fontTools import subset

fonts = list(Path('.next/static/media').glob('*.woff2')) + list(Path('.next/dev/static/media').glob('*.woff2'))
for source in fonts:
    font = TTFont(source)
    family = font['name'].getDebugName(1) or ''
    if family == 'Inter' and all(ord(c) in font.getBestCmap() for c in 'DEVELOPMENTCOPYWRITING'):
        break
else:
    raise RuntimeError('Cannot find the installed Latin Inter font')
print('Using', source, family)
output = Path('public/fonts')
output.mkdir(exist_ok=True)
license_text = '\n\n'.join(font['name'].getDebugName(key) or '' for key in [0, 13, 14])
(output / 'inter-license.txt').write_text(license_text, encoding='utf8')
if 'fvar' in font:
    axes = {axis.axisTag: axis.defaultValue for axis in font['fvar'].axes}
    axes['wght'] = 600
    font = instantiateVariableFont(font, axes, inplace=True)
removeOverlaps(font)
subsetter = subset.Subsetter()
subsetter.populate(text='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,+-&')
subsetter.subset(font)
font.flavor = 'woff2'
font.save(output / 'inter-outline-600.woff2')
print('Saved clean Inter contours for native CSS text stroke.')
