Simple EPub reader for FirefoxOS
================================

WARNING: NOT FUNCTIONAL AT THE MOMENT! (See below)

This is a very simple epub reader for firefoxOS. It is basically a mix
of these other pices of software:

- Firefox PDF viewer https://github.com/kerycdiaz/PDFViewer-FirefoxOs
- EPUB for Monocle https://github.com/rschroll/efm
- Monocle https://github.com/joseph/monocle

I used the first one to build the interface that scans the sdcard
for ebooks, the titles, etc, and the second one to build a client-only
book data object needed by monocle, then monocle to create the reader.

At the moment, though, the first part works, you can choose an epub file
from the sdcard, it is correctly unzipped and the bookdata object is
created, but the reader is not created. It works from a desktop browser,
though (if no sdcard is detected, I added the possibility to upload an
epub file). I still couldn't find what is wrong when running from
firefoxOS (the damn simulator doesn't emulate sdcards, and I couldn't
enable remote debugging on the actual device, so I have no way to know)

If you can help me to throw a light on those problems, please open an
issue, thanks!
