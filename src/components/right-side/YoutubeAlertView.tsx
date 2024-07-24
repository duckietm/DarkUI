import { useState } from 'react';
import { CreateLinkEvent, GetRoomSession } from '../../api';
import { Base, Button, Column, Flex, Text } from '../../common';
const YoutubeAlertView = () => {
  const [ isOpen, setIsOpen ] = useState<boolean>(false);
  
  if(GetRoomSession() === null ) return null;

  return (
    <Base className="nitro-notification-bubble rounded animate__animated animate__fadeInRight animate__fast" style={{marginBottom: "2px"}}>
        <Column>
            <Flex alignItems="center" justifyContent="between" pointer onClick={ event => setIsOpen(value => !value) }>
                <Text small variant="white">YouTube Room</Text>
                <i className={ isOpen ? 'fas fa-chevron-up' : 'fas fa-chevron-down' } />
            </Flex>
            { isOpen &&
                <>
                    <Button fullWidth variant="dark" onClick={ () => CreateLinkEvent('ytplayer/show') }>
                        Entrar a la sala de YouTube
                    </Button>
                </> }
        </Column>
    </Base>
  )
}

export default YoutubeAlertView
