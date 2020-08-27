/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {

	/***
	 * CKeditor config
	 * Resize
			config.resize_enabled
			config.resize_minWidth and config.resize_maxWidth
			config.resize_minHeight and config.resize_maxHeight
	 * Filebrowser
			config.filebrowserBrowseUrl = "../../resource/ckeditor/ckfinder/ckfinder.html",
			config.filebrowserUploadUrl = "../../resource/ckeditor/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files",
			config.filebrowserImageUploadUrl = "../../resource/ckeditor/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images",
			config.filebrowserFlashUploadUrl = "../../resource/ckeditor/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Flash",
			config.filebrowserImageThumbsUploadUrl = 'upload.php?type=Images&makeThumb=true';
			config.filebrowserImageResizeUploadUrl = 'upload.php?type=Images&resize=true';
			config.doksoft_uploader_url = '';
	 * Basic Plugin
	 		config.plugins = 'dialogui,dialog,about,basicstyles,clipboard,button,toolbar,enterkey,entities,floatingspace,wysiwygarea,indent,indentlist,fakeobjects,link,list,undo';
	 * Standard Plugin
	 		config.plugins = 'dialogui,dialog,about,a11yhelp,basicstyles,blockquote,clipboard,panel,floatpanel,menu,contextmenu,resize,button,toolbar,elementspath,enterkey,entities,popup,filebrowser,floatingspace,listblock,richcombo,format,horizontalrule,htmlwriter,wysiwygarea,image,indent,indentlist,fakeobjects,link,list,magicline,maximize,pastetext,pastefromword,removeformat,showborders,sourcearea,specialchar,menubutton,scayt,stylescombo,tab,table,tabletools,undo,wsc';
	 * Full Plugin
	 		config.plugins = 'dialogui,dialog,about,a11yhelp,dialogadvtab,basicstyles,bidi,blockquote,clipboard,button,panelbutton,panel,floatpanel,colorbutton,colordialog,templates,menu,contextmenu,div,resize,toolbar,elementspath,enterkey,entities,popup,filebrowser,find,fakeobjects,flash,floatingspace,listblock,richcombo,font,forms,format,horizontalrule,htmlwriter,iframe,wysiwygarea,image,indent,indentblock,indentlist,smiley,justify,menubutton,language,link,list,liststyle,magicline,maximize,newpage,pagebreak,pastetext,pastefromword,preview,print,removeformat,save,selectall,showblocks,showborders,sourcearea,specialchar,scayt,stylescombo,tab,table,tabletools,undo,wsc';
	***/

	// Ngon ngu
	config.language = 'vi';

	// UI color
	config.uiColor = '#CCCCCC';

	// Skin
	config.skin = 'moono_blue';

	/***
	 * Cho phep cac the
	 * config.allowedcontent = "p h1{text-align}; a[!href]; strong em; p(tip)";
	***/
	config.allowedContent = true; // to allow all

   // Cho phep them mot so the
	config.extraAllowedContent = '';

	// Khong tu dong kt chinh ta
	config.scayt_autoStartup = false;
	config.disableNativeSpellChecker = true;

	// File browser
	config.filebrowserBrowseUrl = "../../resource/ckeditor/ckfinder/ckfinder.html",
	config.filebrowserUploadUrl = "../../resource/ckeditor/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files",
	config.filebrowserImageUploadUrl = "../../resource/ckeditor/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images",
	config.filebrowserFlashUploadUrl = "../../resource/ckeditor/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Flash",

	// My Plugin
	config.plugins =
	// Plugin
		'dialogui,' + // Core
		'dialog,' + // Core
		'dialogadvtab,' +	// Core - Dùng nâng cao cho dialog Link,Image,Flash,Table,IFrame,Div Container
		'button,' + // Core
		'panelbutton,' + // Core - Nâng cao của button trình đơn thả xuống, vd: bảng điều khiển màu sắc, ...
		'panel,' + // Plugin này sử dụng cùng với các plugin floatpanel cung cấp cơ sở của tất cả các bảng giao diện người dùng biên tập - thả xuống, menu, vv
		'floatpanel,' + // Plugin này cùng với các plugin của bảng điều khiển là cung cấp cơ sở của tất cả các bảng giao diện người dùng biên tập - thả xuống, menu, vv
		'menu,' + // Plugin chứa phương pháp để xây dựng thực đơn CKEditor (ví dụ như trình đơn ngữ cảnh hoặc menu thả xuống).
		'contextmenu,' + // menu ngữ cảnh sử dụng thay vì trình duyệt, manage menu item and group
		'resize,' + // thay đổi kích thước editor
		'elementspath,' + // Ở dưới cùng cho biết danh sách HTML và thẻ HTML hiện tại ở vị trí con trỏ
		'enterkey,' + // Điều chỉnh hành động khi nhấn enter, shift + enter, ...
		'entities,' + // entities code
		'popup,' + // thêm một chức năng công cụ để mở trang web trong cửa sổ popup.
		'filebrowser,' + // Liên kết ckeditor với bất kỳ trình quản lý file nào bên ngoài
		'fakeobjects,' +
		'floatingspace,' + // Điều chỉnh vị trí tốt nhất cho ckeditor ở chế độ inline
		'listblock,' + // xây dựng một danh sách thả trong bảng biên tập. vd: thấy trong rich combo, list item with label
		'richcombo,' + // sử dụng để xây dựng Dropdowns như Styles, Định dạng, cỡ chữ, vv
		'htmlwriter,' + // linh hoạt đầu ra định dạng HTML, với một số tùy chọn cấu hình để kiểm soát các định dạng đầu ra trình biên tập.
		'menubutton,' + // cung cấp một giao diện người dùng phần nút menu khi nhấp vào sẽ mở ra một trình đơn thả xuống với một danh sách các tùy chọn.
		'liststyle,' + // Thêm danh sách số
		'magicline,' + // làm dễ dàng hơn để đặt con trỏ và thêm nội dung tại thẻ như images, tables hoặc <div>
		'showborders,' + // hiển thị đường viền xung quanh bảng.
		'tab,' + // Hỗ trợ xử lý tab trên editor. vd: tab trên table
	// Line 1
		'sourcearea,' + // Mã nhúng
		//'save,' + // Lưu
		//'newpage,' + // Trang mới
		'preview,' + // Xem trước
		'print,' + // In
		//'templates,' + // Mẫu
		'clipboard,' + // Cut, Copy, Paste
		'pastetext,' + // Copy như text
		'pastefromword,' + // Copy từ word - Gồm cả clipboard
		//'undo,' + // Hoàn tác
		'find,' + // Tìm và thay thế
		//'selectall,' + // Chọn tất cả
		//'wsc,' + // Button kiểm tra chính tả
		//'scayt,' + // Kiểm tra chính tả
		//'forms,' + // Form
	// Line 2
		'basicstyles,' + // B, I, U ...
		'removeformat,' + // Loại bỏ style
		'list,' + // Ul,li
		'indent,' + // marginleft 40px
		'indentblock,' + // marginleft 40px
		'indentlist,' + // marginleft 40px
		//'blockquote,' + // Quote
		//'div,' + // Div
		'justify,' + // Căn chỉnh
		//'bidi,' + // Trái sang phải, phải sáng trái
		//'language,' + // Chọn ngôn ngữ
		'link,' + // Đường dẫn
		'image,' + // Ảnh
		//'flash,' + // Flash
		'table,' + // Kẻ bảng
		'tabletools,' + // Kẻ bảng
		'horizontalrule,' + // Line <hr>
		//'smiley,' + // Mặt cười
		//'specialchar,' + // Ký tự đặc biệt
		//'pagebreak,' + // Ngắt trang
		'iframe,' + // Iframe
	// Line 3
		'stylescombo,' + // Style
		'format,' + // Format
		'font,' + // Font + size
		'colorbutton,' + // Color button
		'colordialog,' + // Color dialog
		'maximize,' + // Full width height ckeditor
		//'showblocks,' + // Show block
		//'about,' + // Giới thiệu
		//'a11yhelp,' + // Help - Dùng alt + 0 để bật hướng dẫn
	// Toolbar create
		'toolbar,' + // Thanh công cụ
		'wysiwygarea' // Khởi tạo
		;

	// Them Plugin
	config.extraPlugins = 'image2,quicktable,simpleuploads,imagemaps,accordion,doksoft_stat,doksoft_backup,doksoft_button,doksoft_youtube,doksoft_maps,doksoft_html';

	// Xoa Plugin
	//config.removePlugins = 'forms, save, print, newpage, templates, bidi';

	/***
	 * Toolbar
	 * config.toolbarCanCollapse = false;
	 * config.colorButton_enableMore = false;
	 * Full
		 	config.toolbar = [
				{ name: 'document', items : [ 'Source','-','Save','NewPage','DocProps','Preview','Print','-','Templates' ] },
				{ name: 'clipboard', items : [ 'Cut','Copy','Paste','PasteText','PasteFromWord','-','Undo','Redo' ] },
				{ name: 'editing', items : [ 'Find','Replace','-','SelectAll','-','SpellChecker', 'Scayt' ] },
				{ name: 'forms', items : [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton',
			        'HiddenField' ] },
				'/',
				{ name: 'basicstyles', items : [ 'Bold','Italic','Underline','Strike','Subscript','Superscript','-','RemoveFormat' ] },
				{ name: 'paragraph', items : [ 'NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote','CreateDiv',
				'-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','BidiLtr','BidiRtl' ] },
				{ name: 'links', items : [ 'Link','Unlink','Anchor' ] },
				{ name: 'insert', items : [ 'Image','Flash','Table','HorizontalRule','Smiley','SpecialChar','PageBreak','Iframe' ] },
				'/',
				{ name: 'styles', items : [ 'Styles','Format','Font','FontSize' ] },
				{ name: 'colors', items : [ 'TextColor','BGColor' ] },
				{ name: 'tools', items : [ 'Maximize', 'ShowBlocks','-','About' ] }
			];
	***/
	config.toolbar = [
		{ name: 'document', items : [ 'Source' ] },
		{ name: 'more', items : [ 'Preview','Print','Find' ] },
		{ name: 'clipboard', items : [ 'PasteText','PasteFromWord' ] },
		{ name: 'links', items : [ 'Link','Unlink','Anchor' ] },
		{ name: 'insert', items : [ 'Image','addImage','addFile','ImageMaps'] },
		{ name: 'smart', items : [ 'doksoft_html','Table','doksoft_button','doksoft_youtube','doksoft_maps','doksoft_backup_save','doksoft_backup_load','Accordion' ] },
		{ name: 'tools', items : [ 'Maximize' ] },
		'/',
		{ name: 'styles', items : [ 'Styles','Format','Font','FontSize' ] },
		{ name: 'basicstyles', items : [ 'Bold','Italic','Underline','-','RemoveFormat' ] },
		{ name: 'colors', items : [ 'TextColor','BGColor' ] },
		{ name: 'paragraph', items : [ 'JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','NumberedList','BulletedList','-','Outdent','Indent','-' ] },

	];

	/***
	 * SimpleUpload Config
 	***/

	// Dung luong file cho phep
	config.simpleuploads_maxFileSize = '';

	// File khong hop le
	config.simpleuploads_invalidExtensions = '';

	// File hop le
	config.simpleuploads_acceptedExtensions ='doc|docx|xls|xlsx|ppt|pdf|txt|rar|zip|jpeg|jpg|gif|png|bmp';

	// File anh hop le
	config.simpleuploads_imageExtensions = 'jp?g|gif|png|bmp';

	// Kiem tra kich thuoc toi da
	config.simpleuploads_maximumDimensions = true;

	// Convert file tu bmp sang png
	config.simpleuploads_convertBmp = true;

	/***
	 * Doksoft Backup
 	***/
 	config.doksoft_backup_interval = 3E4; // 30s
 	config.doksoft_backup_snapshots_limit = 20; // 20 ban ghi
 	config.doksoft_backup_save_before_load = true; // Luu truoc khi soan thao
 	config.doksoft_backup_move_to_footer = true;
 	config.doksoft_backup_add_background_in_footer = true;
 	config.doksoft_backup_add_text_to_load_button = true;
	config.doksoft_backup_date_format = "HH:MM dd/mm/yyyy";
	config.doksoft_backup_additional_id = "";

	/***
	 * Doksoft Youtube
 	***/
 	config.doksoft_youtube_apiKey = 'AIzaSyA-aKbivWEGhF97A57LAEnyKl1-j57YBEc';
 	config.doksoft_youtube_maxResults = 25;
	config.doksoft_youtube_showSuggested = true;
	config.doksoft_youtube_enablePrivacyMode = false;
	config.doksoft_youtube_useOldCode = false;

};