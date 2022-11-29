import githubLight from '../githubLight.png';
export default function Header() {
	return (
		<div className="header">
			<h1>Job search</h1>
			<a
				href="https://github.com/glacea7"
				target="_blank"
				rel="noreferrer"
				style={{
					textDecoration: 'none',
					color: 'black',
				}}
			>
				<img src={githubLight} alt="github repo" />
			</a>
		</div>
	);
}
