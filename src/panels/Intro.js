import React, { Fragment, useState } from 'react';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import { Avatar, Button, Div, FixedLayout, Group } from '@vkontakte/vkui';

import './Intro.css'
import polytech_logo from '../img/polytech_logo.png';
import { Checkbox } from '@vkontakte/vkui/dist/components/Checkbox/Checkbox';
import { func } from 'prop-types';

const Intro = ({id, fetchedUser, go, hasUserSeenIntro, snackError}) => { 
    const [checked, setChecked] = useState(false);

    return (
        <Panel id={id} centered={true}>
            {fetchedUser && !hasUserSeenIntro &&
            <Fragment>
                    <Div className='User'>
                        <img className="Polytech_logo" src={polytech_logo} alt="Polytech_logo"/>
                        {fetchedUser.photo_200 && <Avatar src={fetchedUser.photo_200} />}
                        <h2>Привет, {fetchedUser.first_name}</h2>
                        <h3>Здесь будет куча текста с кучей всяких ссылочек, а пока нажми Продолжить. Жми жми, не бойся</h3>                  
                        <Checkbox onChange={()=>setChecked(!checked)}>
                            Принимаю лицензионное соглашение, которое никогда не прочту
                        </Checkbox>
                    </Div>
                <FixedLayout vertical="bottom">
                    <Div>
                        <Button disabled={!checked} stretched mode="commerce" size="l" onClick={go}>
                            Продолжить
                        </Button>
                    </Div>       
                    {snackError}
                </FixedLayout>
            </Fragment>
            }
        </Panel>
    );
}
export default Intro;
