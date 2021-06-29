import React from 'react';
import { useState } from 'react';
import Button from '@material-ui/core/Button';
import { storage, db } from '../firebase';
import firebase from 'firebase';
import { Input } from '@material-ui/core';

const ImageUpload = ({ username }) => {
	const [image, setImage] = useState(null);
	const [progress, setProgress] = useState(0);
	const [caption, setCaption] = useState('');
	const [open, setOpen] = useState(false);

	const handleChange = (e) => {
		if (e.target.files[0]) {
			setImage(e.target.files[0]);
		}
	};

	const handleUpload = () => {
		const uploadTask = storage.ref(`images/${image.name}`).put(image);

		uploadTask.on(
			'state_changed',
			(snapshot) => {
				const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
				setProgress(progress);
			},
			(error) => {
				console.log(error);
				alert(error.message);
			},
			() => {
				storage
					.ref('images')
					.child(image.name)
					.getDownloadURL()
					.then((url) => {
						db.collection('posts').add({
							timestamp: firebase.firestore.FieldValue.serverTimestamp(),
							caption: caption,
							imgUrl: url,
							username: username,
						});

						setProgress(0);
						setCaption('');
						setImage(null);
					});
			}
		);
	};

	return (
		<div>
			<div className="imageUpload__button">
				<Button type="button" onClick={(e) => setOpen((prev) => !prev)} variant="outlined">
					Upload
				</Button>
			</div>

			{open ? (
				<div className="imageUpload">
					<div className="imageUpload__uploadProgress">
						<input type="file" onChange={handleChange} />
						<progress value={progress} max="100" />
					</div>
					<div className="imageUpload__captionButton">
						<Input
							className="captionButton__input"
							type="text"
							placeholder="Enter a caption"
							onChange={(e) => setCaption(e.target.value)}
							value={caption}
						/>
						<Button variant="outlined" onClick={handleUpload}>
							Upload
						</Button>
					</div>
				</div>
			) : (
				''
			)}
		</div>
	);
};

export default ImageUpload;
