import { HabboSearchComposer, HabboSearchResultData, HabboSearchResultEvent } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { GetUserProfile, LocalizeText, SendMessageComposer } from '../../../../api';
import { Column, LayoutAvatarImageView, NitroCardAccordionSetViewProps, Text, UserProfileIconView } from '../../../../common';
import { useFriends, useMessageEvent } from '../../../../hooks';

export const FriendsSearchView: FC<FriendsSearchViewProps> = props =>
{
    const { ...rest } = props;
    const [searchValue, setSearchValue] = useState('');
    const [friendResults, setFriendResults] = useState<HabboSearchResultData[]>(null);
    const [otherResults, setOtherResults] = useState<HabboSearchResultData[]>(null);
	const [inputValue, setInputValue] = useState('');
	
	const { canRequestFriend = null, requestFriend = null } = useFriends();

    useMessageEvent<HabboSearchResultEvent>(HabboSearchResultEvent, event =>
    {
        const parser = event.getParser();

        setFriendResults(parser.friends);
        setOtherResults(parser.others);
    });

    useEffect(() =>
    {
        if (!searchValue || !searchValue.length) return;

        const timeout = setTimeout(() =>
        {
            if (!searchValue || !searchValue.length) return;

            SendMessageComposer(new HabboSearchComposer(searchValue));
        }, 500);

        return () => clearTimeout(timeout);
    }, [searchValue]);

    return (
        <div style={{ padding: "10px", overflow:"auto" }}>
            <div className='row mb-2'>
                <div className="col-md-10">
                    <input type="text" style={{ height: "37px" }} className="search-input form-control w-100 rounded-0" placeholder={LocalizeText('generic.search')} value={inputValue} maxLength={50} onChange={event => setInputValue(event.target.value)} />
                </div>
                <div className='col-md-2'>
                    <button onClick={() => setSearchValue(inputValue)} className='btn w-100' style={{ backgroundColor: "var(--colors-secondary)" }}>
                        <div className='icon icon-search'></div>
                    </button>
                </div>
            </div>
            <Column>
                {friendResults &&
                    <>
                        {(friendResults.length === 0) &&
                            <Text variant="white" bold className="px-2 py-1">{LocalizeText('friendlist.search.nofriendsfound')}</Text>}
                        {(friendResults.length > 0) &&
                            <Column gap={0}>
                                <Text variant="white" bold className="px-2 py-1">{LocalizeText('friendlist.search.friendscaption', ['cnt'], [friendResults.length.toString()])}</Text>
                                <hr className="mx-2 mt-0 mb-1 text-black" />
                                <Column gap={0}>
                                    {friendResults.map(result =>
                                    {
                                        return (
                                            <div key={result.avatarId} className="row mt-1 friendlist-element" style={{ padding: "20px", position: "relative" }}>
                                                <div className='col-md-6'>
                                                    <div className='row'>
                                                        <div className='col-md-3'>
															<div className="nitro-chat-avatar-card">
																<LayoutAvatarImageView className="nitro-chat-avatar-image-search" figure={result.avatarFigure} headOnly={true} direction={4} />
															</div>
                                                        </div>
                                                        <div className='col-md-9'>
                                                            <div className="ms-2 mt-3">
                                                                <Text variant="white" fontSize={4} bold>{result.avatarName}</Text>
                                                                <div className="mt-n2">
                                                                    <Text fontSize={5} variant="muted">{result.avatarMotto}</Text>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-md-6'>
                                                    <div style={{ float: "right", marginTop: "13px" }}>
                                                        <button className='btn btn-sm btn-muted' onClick={event => GetUserProfile(result.avatarId)} style={{ fontSize: "12px" }}>{LocalizeText('friendbar.request.profile')}</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </Column>
                            </Column>}
                    </>}
                {otherResults &&
                    <>
                        {(otherResults.length === 0) &&
                            <Text variant="white" bold className="px-2 py-1">{LocalizeText('friendlist.search.noothersfound')}</Text>}
                        {(otherResults.length > 0) &&
                            <Column gap={0}>
                                <Text variant="white" bold className="px-2 py-1">{LocalizeText('friendlist.search.otherscaption', ['cnt'], [otherResults.length.toString()])}</Text>
                                <hr className="mx-2 mt-0 mb-1 text-black" />
                                <Column gap={0}>
                                    {otherResults.map(result =>
                                    {
                                        return (
                                            <div key={result.avatarId} className="row mt-1 friendlist-element" style={{ padding: "20px", position: "relative" }}>
                                                <div className='col-md-6'>
                                                    <div className='row'>
                                                        <div className='col-md-9'>
                                                            <div>
                                                                <Text variant="white" fontSize={4} bold>{result.avatarName}</Text>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-md-6'>
                                                    <div style={{ float: "right", marginTop: "13px" }}>
                                                        <button className='btn btn-sm btn-muted m-1' onClick={event => GetUserProfile(result.avatarId)} style={{ fontSize: "12px" }}>{LocalizeText('friendbar.request.profile')}</button>;
                                                        {canRequestFriend(result.avatarId) && <button className='btn btn-sm btn-muted' onClick={event => requestFriend(result.avatarId, result.avatarName)} style={{ fontSize: "12px" }}>{LocalizeText('friendbar.request.title')}</button>}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </Column>
                            </Column>}
                    </>}
            </Column>
        </div>
    );
}
