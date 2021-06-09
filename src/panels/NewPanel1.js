import React, { Fragment, useState } from 'react';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import { Avatar, Button, Div, FixedLayout, Group } from '@vkontakte/vkui';


const NewPanel1 = ({id, fetchedUser, go, hasUserSeenIntro, snackError, back}) => { 
    return (
        <Panel id={id} centered={true}>
            <Div>
                Привет я еще одна панелька
            </Div>
            <Button onClick={back}>
                Назад
            </Button>
        </Panel>
    );
}
export default NewPanel1;
