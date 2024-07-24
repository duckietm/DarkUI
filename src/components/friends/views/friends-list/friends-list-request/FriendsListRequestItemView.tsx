import { FC } from 'react';
import { GetUserProfile, MessengerRequest } from '../../../../../api';
import { Text } from '../../../../../common';
import { useFriends } from '../../../../../hooks';

export const FriendsListRequestItemView: FC<{ request: MessengerRequest }> = props =>
{
    const { request = null } = props;
    const { requestResponse = null } = useFriends();

    if (!request) return null;

    return (
        <div style={{ padding: "20px", position: "relative" }} className={`row gx-0 mt-1 friendlist-element`}>
            <div className='col-md-6'>
                <div className='row'>
                    <div className='col-md-3'>
                        <div onClick={event => GetUserProfile(request.id)}>
                            <div className="nitro-chat-avatar-card">
                                <img className="nitro-chat-avatar-image" src={`https://imager.bobba.chat/?figure=${request.figureString}&direction=4&head_direction=4&headonly=1`} />
                            </div>
                        </div>
                    </div>
                    <div className='col-md-9'>
                        <div style={{ marginTop: "14px" }}>
                            <Text variant="white" bold>{request.name}</Text>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-md-6'>
                <div style={{ float: "right", marginTop: "13px" }}>
                    <button className='btn btn-sm btn-success' onClick={(e) => { requestResponse(request.id, true) }} style={{ fontSize: "12px" }}>Aceptar</button>&nbsp;
                    <button className='btn btn-sm btn-danger' onClick={(e) => { requestResponse(request.id, false) }} style={{ fontSize: "12px" }}>Rechazar</button>&nbsp;
                    <button className='btn btn-sm btn-muted' onClick={event => GetUserProfile(request.id)} style={{ fontSize: "12px" }}>Perfil</button>
                </div>
            </div>
        </div>
    );
}
