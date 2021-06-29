import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Posts from './components/Posts';
import { db } from './firebase';
import ImageUpload from './components/ImageUpload';

function App() {
	const [posts, setPosts] = useState([]);
	const [username, setUsername] = useState('');

	console.log(username);

	const usernameSet = (e) => {
		setUsername(e.target.value);
	};

	useEffect(() => {
		db.collection('posts')
			.orderBy('timestamp', 'desc')
			.onSnapshot((snapshot) => {
				setPosts(snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() })));
			});
	}, []);

	return (
		<div className="App">
			<Header username={username} setUsername={setUsername} usernameSet={usernameSet} />
			{posts.map(({ id, post }) => (
				<Posts
					key={id}
					postId={id}
					caption={post.caption}
					imgUrl={post.imgUrl}
					username={post.username}
				/>
			))}
			<ImageUpload username={username} />
		</div>
	);
}

export default App;
