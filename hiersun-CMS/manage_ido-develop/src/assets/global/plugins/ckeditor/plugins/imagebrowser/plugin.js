CKEDITOR.plugins.add('imagebrowser', {
	"init": function (editor) {
		if (typeof(editor.config.imageBrowser_listUrl) === 'undefined' || editor.config.imageBrowser_listUrl === null) {
			return;
		}
		// url = localStorage.getItem("imageBrowser_listUrl");
		editor.config.filebrowserImageBrowseUrl = editor.plugins.imagebrowser.path + "browser/browser.html?listUrl=";
		// localStorage.removeItem('imageBrowser_listUrl');
	}
});
