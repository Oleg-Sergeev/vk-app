import React, { Fragment, useState } from 'react';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import { Avatar, Button, Div, FixedLayout, Group } from '@vkontakte/vkui';


const NewPanel = ({id, fetchedUser, go, hasUserSeenIntro, snackError, back}) => { 
    return (
        <Panel id={id} centered={true}>   
            <Div>
                Привет я панелька
            </Div>
            <Button onClick={back}>
                Назад
            </Button>
            <Button onClick={go} data-to={'NewPanel1'}>
                Вперед
            </Button>
        </Panel>
    );
}
export default NewPanel;
