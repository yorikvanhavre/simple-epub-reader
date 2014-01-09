// Adapted from Pdf Viewer for FirefoxOS - https://github.com/kerycdiaz/PDFViewer-FirefoxOs
// And EFM Reader by RSchroll - https://github.com/rschroll/efm

// First, we need to tell zip.js where to find its accessory files.
zip.workerScriptsPath = "js/"

// Adds an entry to the books list
function addToList(file) {
    if (file.name.match(/.epub$/)) {
        if (file.name.match(/.Ebooks*/)) {
            last = file.name.split("/").pop();
            epub = last.charAt(0).toUpperCase() + last.slice(1);
            epub = epub.replace(/_/g," ");
            epub = epub.replace(".epub","");
            epub = epub.split("-");
            l1 = epub[0];
            if (l1.length > 1) {
                l2 = epub[1];
            } else {
                l2 = "";
            }
            l = '<li id="'+file.name+'"><a href="#"><p>' + l1 + '</p><p>' + l2 + '</p></a></li>';
            $("#item-list").append(l);
        }
    }  
}

// Creates an EPUB object from a file on the sdcard
function createEpub(filename) {
    $("#list").hide();
    $("#reader").show();
    $("#reader").html('<p>Opening ebook...</p>');
    $("#header").hide();
    var epubfile = sdcard.get(filename);
    ok = false;
    epubfile.onsuccess = function() {
        if (ok == false) {
            console.log("opening file: "+filename);
            var file = this.result;
            new Epub(file, createReader);
            //console.log("epub object: "+Epub);
            //$("#item-list").append('<li><p>Successfully opened ebook</p></li>');
            ok = true;
        }
    }
    epubfile.onerror = function() {
        $("#item-list").append('<li><p>Error opening ebook</p></li>');
    }
}

// This will be called when the Epub object is fully initialized and
// ready to get passed to the Monocle.Reader.
function createReader(bookData) {
    //$("#reader").html('<p>Creating reader...</p>');
    $("#reader").append('<p>Creating reader...</p>');
    $("#title").addClass("skin-organic");

    console.log("bookdata: "+bookData);
    
    Monocle.Reader("reader",bookData);

    /*
    Monocle.Reader("reader", bookData,  // The id of the reader element and the book data.
        { flipper: Monocle.Flippers.Instant,  // The rest is just fanciness:
          panels: Monocle.Panels.Magic },     // No animation and click anywhere
          function (reader) {                   // to turn pages.
            var stencil = new Monocle.Controls.Stencil(reader);  // Make internal links work.
            reader.addControl(stencil);
            var toc = Monocle.Controls.Contents(reader);         // Add a table of contents.
            reader.addControl(toc, 'popover', { hidden: true });
            createBookTitle(reader, { start: function () { reader.showControl(toc); } });
          }
        );
    */
}

// This adds the book title to the top of each page.
function createBookTitle(reader, contactListeners) {
    var bt = {}
    bt.createControlElements = function () {
        cntr = document.createElement('h3');
        cntr.id = "bookTitle";
        cntr.innerHTML = reader.getBook().getMetaData('title');
        if (contactListeners) {
            Monocle.Events.listenForContact(cntr, contactListeners);
        }
        return cntr;
    }
    reader.addControl(bt, 'page');
    return bt;
}

// if sdcard is not available (we are not on firefoxOS), show file dialog
function showUploader() {
    $("#item-list").append('<li id="Message"><p>Select a file to upload:</p></li>');
    $("#item-list").append('<li><p><input type="file" id="file" accept="application/epub+zip" onchange="fileSelected(event)" /></p></li>');
}

// An event handler for our file input.
function fileSelected(event) {
    var files = event.target.files;
    if (files.length > 0)
        $("#list").hide();
        $("#reader").show();
        $("#reader").html('<p>Opening ebook...</p>');
        $("#header").hide();
        new Epub(files[0], createReader);
}

// This is the "start" function
(function () {

    console.log("simple epub reader starting")

    if (navigator.getDeviceStorage) {

        sdcard = navigator.getDeviceStorage("sdcard");

        $("#reader").hide();

        function load(){
            console.log("loading files from sdcard");
            $('#item-list li').remove();
            $("#item-list").append('<li id="Message"><p>Searching for Ebooks...</p></li>');
            var all_files = sdcard.enumerate("");
            flagError = true;
            flagOk = true;

            all_files.onsuccess = function() {
                while (all_files.result) {
                    var each_file = all_files.result;
                    addToList(each_file);
                    all_files.continue();
                }
                
                if($('li').size() == 0){
                    if(flagError) {
                        $("#item-list").append('<li id="Message"><p>No epub file found.</p></li>');
                        flagError = false;
                    }
                } else {
                    if(flagOk){
                        flagOk = false;
                        $("#Message").html('<p>Please choose an ebook to open:</p>');
                    }
                }
                $('#item-list li').click(function(){
                    //$("#item-list").append('<li><p>click</p></li>');
                    if ($(this).attr("id") != "Message"){
                        var filename = $(this).attr("id");
                        //flagOk = false;
                        //$('#item-list li').remove();
                        createEpub(filename);
                    }
                });
            };

            all_files.onerror = function(){
                console.log("error reading from sdcard");
                $('#item-list li').remove();
                $("#item-list").append('<li id="Message"><p>Unable to access the sdcard.</p></li>');
                showUploader();
            }
        }

        refreshBtn = document.querySelector("#refreshBtn");
        refreshBtn.addEventListener ('click', function () {
          load();
        });

        load();

    } else {
        $('#item-list li').remove();
        $("#item-list").append('<li id="Message"><p>No sdcard found.</p></li>');
        showUploader();
    }
})();