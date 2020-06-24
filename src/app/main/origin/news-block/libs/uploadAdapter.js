/**
 * Upload adapter for CKEditor
 * Developped by Mohamed Kharrat de Tekru
 * kharrat.mohamed [at] gmail.com
 * [URL] tekru.net
 */

import { contentService } from 'app/services/originServices';

class tkrUploadAdapter {
    constructor(loader, params=null) {
		this.loader = loader;
		this.params = {};
    }

    // Starts the upload process.
    upload() {
		const loader = this.loader;
    	return this.loader.file
    		.then(file => new Promise((resolve, reject) => {
				contentService.uploadImage(file)
					.then((response) => {
						//setSendingPicture(false);
						loader.uploaded = true;
						resolve({
							default: response
						});
					})
					.catch(error => {
						loader.uploaded = false;
						reject(error);
					});
    		}));
    }

    // Aborts the upload process.
    abort() {
    	// todo
	}
}
export default tkrUploadAdapter;