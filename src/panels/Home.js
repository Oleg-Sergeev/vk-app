import React, { useEffect, useState } from 'react';
import bridge from '@vkontakte/vk-bridge';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import { FormItem, Input } from '@vkontakte/vkui';

import DatePicker from 'react-date-picker';
import Calendar from 'react-calendar';

const Home = ({ id, go, fetchedUser, snackError }) => { 
	const [notifies, setNotifies] = useState({});
	const [value, setValue] = useState('');


	const [date, setDate] = useState(new Date());
	const [allowedNotifies, setAllow] = useState(false);

	
	const copyText = () => {
		bridge.send('VKWebAppCopyText', {text: value})
	}

	const saveText = async (text) => {
		setValue(text);
		await bridge.send('VKWebAppStorageSet', {
			key: 'someKey',
			value: JSON.stringify(text)
		});
	}
	

	// календарь

	async function getAllNotifies() {
		if (Object.keys(notifies).length) console.log(notifies);
		else {
			try {
			const storageData = await bridge.send('VKWebAppStorageGet', {keys: ['notifies']});	
			const value = JSON.parse(storageData.keys[0].value);	
			setNotifies(value);
			console.log(value);
			}
			catch (error) {
				console.error(error);
			}
		}
	}

	async function showNotifies(date) {
		if (Object.keys(notifies).length) {
			console.log(notifies[date.toDateString()] ?? "No notifies today");
		}
		else {
			try {
			const storageData = await bridge.send('VKWebAppStorageGet', {keys: ['notifies']});	
			const notifies = JSON.parse(storageData.keys[0].value);	

			if (!notifies || !Object.keys(notifies).length) {
				console.log("No notifies today");

				return;
			}

			setNotifies(notifies);
			console.log(notifies[date.toDateString()]);
			}
			catch (error) {
				console.error(error);
				console.log('no any notify');
			}
		}
	}

	async function addNotifies(choosedDate, message) {
		if (!allowedNotifies) {
			try {
				const allow = await bridge.send("VKWebAppAllowNotifications");

				setAllow(allow);
			}
			catch (error){
				console.error(error);
			}
		}


		setDate(choosedDate);

		const key = choosedDate.toDateString();
		
		if (!notifies[key]) notifies[key] = {};

		notifies[key][message] = "12:00:00";

		try{
			await bridge.send('VKWebAppStorageSet', {
				key: 'notifies',
				value: JSON.stringify(notifies)
			});
		}
		catch (error) {
			console.error(error);
		}

		console.log('notify added');

		if (allowedNotifies) {
			// не работает
			try {
				const auth = await bridge.send("VKWebAppGetAuthToken", {
					"app_id":7810593,
					"scope":"friends,status"
				});

				const response = await bridge.send("VKWebAppCallAPIMethod", 
				{
					"method": "notifications.sendMessage",
					"request_id": "32test",
					"params": {
						"user_ids": "227866565",
						"v": "5.130",
						"access_token":auth.access_token,
						"message": "Hello API"
					}
				});

				console.log(response);
			} 
			catch (error) {
				console.error(error);
			}
		}
	}

	//

	useEffect(() => {
		async function getText() {
			try {	
			const storageData = await bridge.send('VKWebAppStorageGet', {keys: ['someKey']});

			setValue(JSON.parse(storageData.keys[0].value));
			} catch(error) {
				console.error('error:', error);
			}
	}
	getText()
	});

	return (
		<Panel id={id}>
			<PanelHeader>Some exaaaaaaample</PanelHeader>
			{fetchedUser &&
			<Group header={<Header mode="primary">Some info</Header>}>
				<Cell
					before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200}/> : null}
					description={fetchedUser.city && fetchedUser.city.title ? fetchedUser.city.title : ''}				
				>
					{`${fetchedUser.first_name} ${fetchedUser.last_name}`}
				</Cell>
			</Group>}

			<Group header={<Header mode="tertiary">Navigation Example</Header>}>
				<Div>
					<Button stretched size="l" mode="overlay_primary" onClick={() => go('intro')}>
						Сбросить интро
					</Button>
					<Button size='m' mode='primary' onClick={copyText}>
						Скопировать текст
					</Button>
					<Button size='m' mode='primary' onClick={getAllNotifies}>
						Уведомления
					</Button>
					<Button size='m' mode='primary' onClick={go} data-to={'NewPanel'}>
						Вперед
					</Button>
					
					<FormItem >
					<Input id='input' type='text' placeholder='Hello world' onChange={(e) => saveText(e.target.value)} defaultValue={value}/>
					</FormItem>
				</Div>

					<Div>
						<Calendar onClickDay={showNotifies} value={date}/>
					</Div>
					<Div>
						<DatePicker onChange={date => addNotifies(date, document.getElementById('input').value)} value={date} />
					</Div>
					
				</Group>
			{snackError}
		</Panel>
	);
}

export default Home;
