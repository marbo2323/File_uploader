var fileUploader = {

	containerName : "fileUploadContainer",
	selectButtonTitle : "Select File",
	selectFileId : "selectFileField",
	formFileFieldId : "formFileField",
	selectedFilesListId : "selectedFiles",
	fileMetadataFieldId : "uploadFileMetadata",
	accept : null,
	containers : null,
	maxSize : 5, // maximum file size in kilobytes
	fileSizeNotValidMessage : "file size is too big",
	fileTypeValidationMassage : "file type is not accepted",

	init : function(options) {
		console.log("fileUploader.init()")
		if (options){
			if (typeof options == "object"){
				this.applyOptions(options);
			}			
		}
		
		this.containers = document.getElementsByClassName(this.containerName);
		this.createFileControls();
	},
	
	applyOptions: function(options){
		for (var opt in options) {
		    if (options.hasOwnProperty(opt)) {
		        console.log(opt);
		        if (this.hasOwnProperty(opt)){
		        	this[opt] = options[opt];
		        }
		    }
		}
	},

	createFileControls : function() {

		thisObject = this;
		var addIndex = this.containers.length > 1?true:false;
		for (var i = 0; i < this.containers.length; i++) {
			console.log(this.containers[i]);
			var index = addIndex?"_" + i:"";
			var container = this.containers[i];
			var formFileFieldId = this.formFileFieldId + index;
			var selectedFileListId = this.selectedFilesListId + index;
			var fileMetadataFieldId = this.fileMetadataFieldId + index;
			
			var selectFile = document.createElement("input");
			selectFile.type = "file";
			selectFile.multiple = true;
			selectFile.accept = this.accept;
			selectFile.id = this.selectFileId + index;
			selectFile.name = this.selectFileId + index;
			selectFile.style.display = "none";

			selectFile.onchange = function() {
				thisObject.afterFileSelect(document.getElementById(selectFile.id), 
						document.getElementById(selectedFileListId),
						document.getElementById(fileMetadataFieldId)						
				);
			};

			var selectButton = document.createElement("label");
			selectButton.innerText = this.selectButtonTitle;
			selectButton.className = "button";
			selectButton.appendChild(selectFile);
			container.appendChild(selectButton);

			var selectedFilesList = document.createElement("div");
			selectedFilesList.id = selectedFileListId;
			container.appendChild(selectedFilesList);
			
			var fileMetadata = document.createElement("input");
			fileMetadata.type = "hidden";
			fileMetadata.id = fileMetadataFieldId;
			fileMetadata.name = fileMetadataFieldId;
			container.appendChild(fileMetadata);

		}
	},

	afterFileSelect : function(selectFile, selectedFilesList, fileMetadataField) {
		console.log("file selected ");
		//console.log(selectButton);
		var fileList = [];
		var fileMetadata = [];
		for (var i = 0; i < selectFile.files.length; i++) {
			console.log(selectFile.files[i].name);
			var file = selectFile.files[i];
			fileList.push("<li>" + file.name + "</li>");
			fileMetadata.push({"name":file.name, "type":file.type, "size":file.size});
		}
		selectedFilesList.innerHTML = "<ul>" + fileList.join('') + "</ul>";
		fileMetadataField.value = JSON.stringify(fileMetadata);

	},

	addFile : function(fileElement, file) {
		var nextIndex = fileElement.files.length;
		console.log(nextIndex);
		fileElement.files[nextIndex] = file;
	},
	
	/**
	 * 	validates file type against this.accept (accepted file types)
	 *  and maximum size against this.maxSize in kilobytes
	 *  takes file element object as input parameter
	 * */  
	isValidFile : function(file){
		var message="";
		var result=true;
		if (file.size > this.maxSize * 1024){
			result = false;
			message += file.name + " " + this.fileSizeNotValidMessage;
		}
		
		if (result && !(!this.accept || this.accept.length == 0)){
			var accTypes = this.accept.split(",");
			var typeIsListed = false;
			for (var i = 0; i < accTypes.length; i++){
				if (file.type == accTypes[i]){
					typeIsListed = true;
					break;
				}
			}
			if (!typeIsListed){
				result = false;
				message += file.name + " " + this.fileTypeValidationMassage;
			}
		}
		return {"result":result, "message":message};
	},
	
	

	endObject : null
}

		