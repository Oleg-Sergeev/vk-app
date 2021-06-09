import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import View from '@vkontakte/vkui/dist/components/View/View';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import { AdaptivityProvider, AppRoot, Div } from '@vkontakte/vkui';
import Snackbar from '@vkontakte/vkui/dist/components/Snackbar/Snackbar';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import Icon24Error from '@vkontakte/icons/dist/24/error';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import Intro from './panels/Intro';
import NewPanel from './panels/NewPanel';
import NewPanel1 from './panels/NewPanel1';

const routes = {
	home: 'home',
	intro: 'intro',
	NewPanel: 'NewPanel',
	NewPanel1: 'NewPanel1'
}

const dataKeys = {
	hasUserSeenIntro: 'hasSeenIntro',
	someKey: 'someKey',
	someJson: 'someJson'
}

let b = false;

const App = () => {
	const [activePanel, setActivePanel] = useState(routes.home);
	const [fetchedUser, setUser] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);
	const [snackbar, setSnackbar] = useState(null);
	const [hasUserSeenIntro, setHasUserSeenIntro] = useState(false);


	function menu(e) {
		console.log('menu: ' + e.state.panel);
		if (e.state) {
			setActivePanel(e.state.panel);
		} else {
			console.log('state is empty');
			setActivePanel(routes.home);
		}
	}


	const createSnackbar = (message, duration) => {
		setSnackbar(
			<Snackbar 
			layout='vertical'
			onClose={() => setSnackbar(null)}
			before={<Avatar size={24} style={{backgroundColor: 'var(--dynamic_red)'}}><Icon24Error fill='#fff' width={14} height={14} /></Avatar>}
			duration={duration ?? 2000}
			>
				{message}
			</Snackbar>
			);
	}
	
	const go = e => {
		console.log(`go:\ncur - ${activePanel}\nnext - ${e.currentTarget.dataset.to}`);
		setActivePanel(e.currentTarget.dataset.to);
		window.history.pushState({panel: e.currentTarget.dataset.to}, `${e.currentTarget.dataset.to}`);
	};
	
	const updateStorage = async (key, value) => {
		await bridge.send('VKWebAppStorageSet', {
			key: key,
			value: JSON.stringify(value)
		});
		console.log(`update storage: [${key}] = ${value}`);
	}

	const handleIntro = async () => {
		try {
			await updateStorage(dataKeys.hasUserSeenIntro, true);

			setHasUserSeenIntro(true);

			go(routes.home);
		} catch (error) {
			createSnackbar(error.message);
		}
	}

	function back() {window.history.back();}

	useEffect(() => {
		window.addEventListener('popstate', e => e.preventDefault() & menu(e));
		window.history.pushState({panel: 'home'}, 'home');

		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_dark';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});
		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			console.log('user: ',user);
			try {
				const storageData = await bridge.send('VKWebAppStorageGet', {keys: Object.values(dataKeys)});
				
				console.log('storage: ',storageData);
				
				const data = {};

				storageData.keys.forEach(({key, value}) => data[key] = value ? JSON.parse(value) : {})
				console.log('data: ',data)
				if (data[dataKeys.hasUserSeenIntro]){
					setHasUserSeenIntro(true);
				}

			} catch(error) {
				createSnackbar(error.message);
			} finally {
				setUser(user);
				setPopout(null);
			}
		}
		fetchData();
	}, []);

	return (
		<AdaptivityProvider>
			<AppRoot>
				<View activePanel={activePanel} popout={popout}>
					<Intro id={routes.intro} fetchedUser={fetchedUser} go={handleIntro} hasUserSeenIntro={hasUserSeenIntro} snackError={snackbar}/>
					<Home id={routes.home} fetchedUser={fetchedUser} go={go} snackError={snackbar}/>
					<NewPanel id={routes.NewPanel} go={go} back={back}/>
					<NewPanel1 id={routes.NewPanel1} go={go} back={back}/>
				</View>
			</AppRoot>
		</AdaptivityProvider>
	);
}



export default App;

