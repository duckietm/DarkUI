import { RelationshipStatusInfoEvent, RelationshipStatusInfoMessageParser, RoomSessionFavoriteGroupUpdateEvent, RoomSessionUserBadgesEvent, RoomSessionUserFigureUpdateEvent, UserRelationshipsComposer } from '@nitrots/nitro-renderer';
import { Dispatch, FC, FocusEvent, KeyboardEvent, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { FaPencilAlt, FaTimes } from 'react-icons/fa';
import { AvatarInfoUser, CloneObject, GetConfiguration, GetGroupInformation, GetSessionDataManager, GetUserProfile, LocalizeText, SendMessageComposer } from '../../../../../api';
import { Column, Flex, LayoutAvatarImageView, LayoutBadgeImageView, Text, UserProfileIconView } from '../../../../../common';
import { useMessageEvent, useRoom, useRoomSessionManagerEvent } from '../../../../../hooks';
import { InfoStandWidgetUserRelationshipsView } from './InfoStandWidgetUserRelationshipsView';
import { InfoStandWidgetUserTagsView } from './InfoStandWidgetUserTagsView';

interface InfoStandWidgetUserViewProps {
    avatarInfo: AvatarInfoUser;
    setAvatarInfo: Dispatch<SetStateAction<AvatarInfoUser>>;
    onClose: () => void;
}

export const InfoStandWidgetUserView: FC<InfoStandWidgetUserViewProps> = ({ avatarInfo = null, setAvatarInfo = null, onClose = null }) => {
    const [motto, setMotto] = useState<string>(null);
    const [isEditingMotto, setIsEditingMotto] = useState(false);
    const [relationships, setRelationships] = useState<RelationshipStatusInfoMessageParser>(null);
    const { roomSession = null } = useRoom();

    const mottoMaxLength = useMemo(() => GetConfiguration<number>('motto.max.length', 38), []);

    const saveMotto = useCallback((motto: string) => {
        if (!isEditingMotto || motto.length > mottoMaxLength) return;

        roomSession.sendMottoMessage(motto);
        setIsEditingMotto(false);
    }, [isEditingMotto, mottoMaxLength, roomSession]);

    const onMottoBlur = useCallback((event: FocusEvent<HTMLInputElement>) => saveMotto(event.target.value), [saveMotto]);

    const onMottoKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
        event.stopPropagation();

        if (event.key === 'Enter') saveMotto((event.target as HTMLInputElement).value);
    }, [saveMotto]);

    useRoomSessionManagerEvent<RoomSessionUserBadgesEvent>(RoomSessionUserBadgesEvent.RSUBE_BADGES, event => {
        if (!avatarInfo || avatarInfo.webID !== event.userId) return;

        if (avatarInfo.badges.join('') === event.badges.join('')) return;

        setAvatarInfo(prevValue => {
            const newValue = CloneObject(prevValue);
            newValue.badges = event.badges;

            return newValue;
        });
    });

    useRoomSessionManagerEvent<RoomSessionUserFigureUpdateEvent>(RoomSessionUserFigureUpdateEvent.USER_FIGURE, event => {
        if (!avatarInfo || avatarInfo.roomIndex !== event.roomIndex) return;

        setAvatarInfo(prevValue => {
            const newValue = CloneObject(prevValue);
            newValue.figure = event.figure;
            newValue.motto = event.customInfo;
            newValue.achievementScore = event.activityPoints;

            return newValue;
        });
    });

    useRoomSessionManagerEvent<RoomSessionFavoriteGroupUpdateEvent>(RoomSessionFavoriteGroupUpdateEvent.FAVOURITE_GROUP_UPDATE, event => {
        if (!avatarInfo || avatarInfo.roomIndex !== event.roomIndex) return;

        setAvatarInfo(prevValue => {
            const newValue = CloneObject(prevValue);
            const clearGroup = event.status === -1 || event.habboGroupId <= 0;

            newValue.groupId = clearGroup ? -1 : event.habboGroupId;
            newValue.groupName = clearGroup ? null : event.habboGroupName;
            newValue.groupBadgeId = clearGroup ? null : GetSessionDataManager().getGroupBadge(event.habboGroupId);

            return newValue;
        });
    });

    useMessageEvent<RelationshipStatusInfoEvent>(RelationshipStatusInfoEvent, event => {
        const parser = event.getParser();

        if (!avatarInfo || avatarInfo.webID !== parser.userId) return;

        setRelationships(parser);
    });

    useEffect(() => {
        setIsEditingMotto(false);
        setMotto(avatarInfo?.motto);
        SendMessageComposer(new UserRelationshipsComposer(avatarInfo?.webID));

        return () => {
            setIsEditingMotto(false);
            setMotto(null);
            setRelationships(null);
        };
    }, [avatarInfo]);

    if (!avatarInfo) return null;

    const badges = avatarInfo.badges.slice(0, 5);

    return (
        <Column className="nitro-infostand rounded">
            <Column overflow="visible" className="container-fluid content-area" gap={1}>
                <Column gap={1}>
                    <Flex alignItems="center" justifyContent="between">
                        <Flex alignItems="center" gap={1}>
                            <UserProfileIconView userId={avatarInfo.webID} />
                            <Text variant="white" small wrap>{avatarInfo.name}</Text>
                        </Flex>
                        <FaTimes className="cursor-pointer fa-icon" onClick={onClose} />
                    </Flex>
                    <hr className="m-0" />
                </Column>
                <Column gap={1}>
                    <Flex gap={1}>
                        <Column fullWidth className="body-image infostand-thumb-bg" onClick={() => GetUserProfile(avatarInfo.webID)}>
                            <LayoutAvatarImageView figure={avatarInfo.figure} direction={4} />
                        </Column>
                        <Column grow alignItems="center" gap={0}>
                            <Flex gap={1}>
                                {badges.slice(0, 1).map((badge, index) => (
                                    <Flex center className="badge-image" key={index}>
                                        <LayoutBadgeImageView badgeCode={badge} showInfo={true}/>
                                    </Flex>
                                ))}
                                {avatarInfo.groupId > 0 && (
                                    <Flex center pointer className="badge-image" onClick={() => GetGroupInformation(avatarInfo.groupId)}>
                                        <LayoutBadgeImageView badgeCode={avatarInfo.groupBadgeId} isGroup={true} showInfo={true} customTitle={avatarInfo.groupName} />
                                    </Flex>
                                )}
                            </Flex>
                            <Flex center gap={1}>
                                {badges.slice(1, 3).map((badge, index) => (
                                    <Flex center className="badge-image" key={index}>
                                        <LayoutBadgeImageView badgeCode={badge} showInfo={true}/>
                                    </Flex>
                                ))}
                            </Flex>
                            <Flex center gap={1}>
                                {badges.slice(3).map((badge, index) => (
                                    <Flex center className="badge-image" key={index}>
                                        <LayoutBadgeImageView badgeCode={badge} showInfo={true}/>
                                    </Flex>
                                ))}
                            </Flex>
                        </Column>
                    </Flex>
                    <hr className="m-0" />
                </Column>
                <Column gap={1}>
                    <Flex alignItems="center" className="bg-light-dark rounded py-1 px-2">
                        {avatarInfo.type !== AvatarInfoUser.OWN_USER ? (
                            <Flex grow alignItems="center" className="motto-content">
                                <Text fullWidth pointer wrap textBreak small variant="white">{motto}</Text>
                            </Flex>
                        ) : (
                            <Flex grow alignItems="center" gap={2}>
                                <FaPencilAlt className="small fa-icon" />
                                <Flex grow alignItems="center" className="motto-content">
                                    {!isEditingMotto ? (
                                        <Text fullWidth pointer wrap textBreak small variant="white" onClick={() => setIsEditingMotto(true)}>{motto}</Text>
                                    ) : (
                                        <input
                                            type="text"
                                            className="motto-input"
                                            maxLength={mottoMaxLength}
                                            value={motto || ''}
                                            onChange={event => setMotto(event.target.value)}
                                            onBlur={onMottoBlur}
                                            onKeyDown={onMottoKeyDown}
                                            autoFocus
                                        />
                                    )}
                                </Flex>
                            </Flex>
                        )}
                    </Flex>
                    <hr className="m-0" />
                </Column>
                <Column gap={1}>
                    <Text variant="white" small wrap>
                        {LocalizeText('infostand.text.achievement_score')} {avatarInfo.achievementScore}
                    </Text>
                    {avatarInfo.carryItem > 0 && (
                        <>
                            <hr className="m-0" />
                            <Text variant="white" small wrap>
                                {LocalizeText('infostand.text.handitem', ['item'], [LocalizeText('handitem' + avatarInfo.carryItem)])}
                            </Text>
                        </>
                    )}
                </Column>
                <Column gap={1}>
                    <InfoStandWidgetUserRelationshipsView relationships={relationships} />
                </Column>
                {GetConfiguration('user.tags.enabled') && (
                    <Column gap={1} className="mt-1">
                        <InfoStandWidgetUserTagsView tags={GetSessionDataManager().tags} />
                    </Column>
                )}
            </Column>
        </Column>
    );
};
