import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import { useEffect } from 'react';
import { auth, db } from '../firebase';
import { Button } from '@material-ui/core';
import firebase from 'firebase';

const Posts = ({ postId, caption, imgUrl, username }) => {
	const [comments, setComments] = useState([]);
	const [comment, setComment] = useState('');

	console.log(postId);

	useEffect(() => {
		let unsubscribe;
		if (postId) {
			unsubscribe = db
				.collection('posts')
				.doc(postId)
				.collection('comments')
				.orderBy('timestamp', 'desc')
				.onSnapshot((snapshot) => {
					setComments(snapshot.docs.map((doc) => doc.data()));
				});
		}

		return () => {
			unsubscribe();
		};
	}, [postId]);

	const addComment = (e) => {
		e.preventDefault();

		db.collection('posts').doc(postId).collection('comments').add({
			comment: comment,
			username: auth.currentUser.displayName,
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
		});

		setComment('');
	};

	return (
		<div className="posts">
			<div className="posts__heading">
				<Avatar className="posts__avatar" alt={username} src="/"></Avatar>
				<h4>{username}</h4>
			</div>
			<img src={imgUrl} />

			<p className="posts__caption">
				<strong>{username} </strong> {caption}
			</p>

			<div className="posts__comment">
				{comments.map((comment) => (
					<p>
						<strong>{comment.username} </strong> {comment.comment}
					</p>
				))}
			</div>

			{auth.currentUser ? (
				<form className="posts__form">
					<input
						type="text"
						className="posts__input"
						placeholder="Add a comment..."
						value={comment}
						onChange={(e) => setComment(e.target.value)}
					/>
					<Button disabled={!comment} type="button" onClick={addComment} variant="outlined">
						ADD
					</Button>
				</form>
			) : (
				''
			)}
		</div>
	);
};

export default Posts;
