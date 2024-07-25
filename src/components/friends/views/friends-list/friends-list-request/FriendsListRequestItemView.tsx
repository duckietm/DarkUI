import { FC } from 'react';
import { GetUserProfile, LocalizeText, MessengerRequest } from '../../../../../api';
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
                    <div className='col-md-9'>
                        <div style={{ marginTop: "14px" }}>
                            <Text variant="white" fontSize={4} bold>{request.name}</Text>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-md-6'>
                <div style={{ float: "right", marginTop: "13px" }}>
                    <button className='btn btn-sm btn-success m-1' onClick={(e) => { requestResponse(request.id, true) }} style={{ fontSize: "12px" }}>{LocalizeText('friendbar.request.accept')}</button>
                    <button className='btn btn-sm btn-danger m-1' onClick={(e) => { requestResponse(request.id, false) }} style={{ fontSize: "12px" }}>{LocalizeText('friendbar.request.decline')}</button>
                    <button className='btn btn-sm btn-muted m-1' onClick={event => GetUserProfile(request.id)} style={{ fontSize: "12px" }}>{LocalizeText('friendbar.request.profile')}</button>
                </div>
            </div>
        </div>
    );
}
