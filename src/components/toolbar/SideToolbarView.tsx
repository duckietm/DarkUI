import { Dispose, DropBounce, EaseOut, ILinkEventTracker, JumpBy, Motions, NitroToolbarAnimateIconEvent, PerkAllowancesMessageEvent, PerkEnum, Queue, Wait } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { AddEventLinkTracker, CreateLinkEvent, GetSessionDataManager, LocalizeText, MessengerIconState, RemoveLinkEventTracker, VisitDesktop } from '../../api';
import { Base, Button, LayoutItemCountView, Text } from '../../common';
import { FaHome, FaTools } from "react-icons/fa";
import { useAchievements, useFriends, useInventoryUnseenTracker, useIsPlaying, useMessageEvent, useMessenger, useRoomEngineEvent, useSessionInfo } from '../../hooks';

const SideToolbarView: FC<{ isInRoom: boolean }> = ({ isInRoom }) => {
  const [isMeExpanded, setMeExpanded] = useState(false);
  const [useGuideTool, setUseGuideTool] = useState(false);
  const { userFigure = null } = useSessionInfo();
  const { getFullCount = 0 } = useInventoryUnseenTracker();
  const { getTotalUnseen = 0 } = useAchievements();
  const { requests = [] } = useFriends();
  const { iconState = MessengerIconState.HIDDEN } = useMessenger();
  const isMod = GetSessionDataManager().isModerator;
  const [isVisible, setIsVisible] = useState(true);
  const { isPlaying } = useIsPlaying();

  const handleLinkReceived = useCallback((url: string) => {
    const parts = url.split('/');

    if (parts.length < 2) return;

    switch (parts[1]) {
      case 'show':
        setIsVisible(true);
        break;
      case 'hide':
        setIsVisible(false);
        break;
      case 'toggle':
        setIsVisible(prevValue => !prevValue);
        break;
      default:
        break;
    }
  }, []);

  useMessageEvent<PerkAllowancesMessageEvent>(PerkAllowancesMessageEvent, event => {
    const parser = event.getParser();
    setUseGuideTool(parser.isAllowed(PerkEnum.USE_GUIDE_TOOL));
  });

  useRoomEngineEvent<NitroToolbarAnimateIconEvent>(NitroToolbarAnimateIconEvent.ANIMATE_ICON, event => {
    const animationIconToToolbar = (iconName: string, image: HTMLImageElement, x: number, y: number) => {
      const target = document.querySelector(`.${iconName}`) as HTMLElement;

      if (!target) return;

      image.className = 'toolbar-icon-animation';
      image.style.visibility = 'visible';
      image.style.left = `${x}px`;
      image.style.top = `${y}px`;

      document.body.append(image);

      const targetBounds = target.getBoundingClientRect();
      const imageBounds = image.getBoundingClientRect();
      const left = imageBounds.x - targetBounds.x;
      const top = imageBounds.y - targetBounds.y;
      const squared = Math.sqrt(left ** 2 + top ** 2);
      const wait = 500 - Math.abs((1 / squared) * 100 * 500 * 0.5);
      const height = 20;
      const motionName = `ToolbarBouncing[${iconName}]`;

      if (!Motions.getMotionByTag(motionName)) {
        Motions.runMotion(new Queue(new Wait(wait + 8), new DropBounce(target, 400, 12))).tag = motionName;
      }

      const motion = new Queue(
        new EaseOut(new JumpBy(image, wait, (targetBounds.x - imageBounds.x) + height, targetBounds.y - imageBounds.y, 100, 1), 1),
        new Dispose(image)
      );

      Motions.runMotion(motion);
    };

    animationIconToToolbar('icon-inventory', event.image, event.x, event.y);
  });

  useEffect(() => {
    const linkTracker: ILinkEventTracker = {
      linkReceived: handleLinkReceived,
      eventUrlPrefix: 'toolbar-view/'
    };

    AddEventLinkTracker(linkTracker);

    return () => RemoveLinkEventTracker(linkTracker);
  }, [handleLinkReceived]);

  return (
    <>
      <div className="side-toolbar-upside">
        <div className='mt-2'>
          {isInRoom &&
            <Button variant="primary-ui-two" className='mt-2' onClick={VisitDesktop}>
              <Text variant='white' bold>
                <FaHome />
				<div>Hotel view</div>
              </Text>
            </Button>}
          {!isInRoom &&
            <Button variant="primary-ui-two" className='mt-2' onClick={() => CreateLinkEvent('navigator/goto/home')}>
              <Text variant='white' bold>
                <FaHome style={{ fontSize: '14px', marginRight: '4px', verticalAlign: 'middle' }} />
				<div>Home</div>
              </Text>
            </Button>}
          {isMod && 
            <Button variant="primary-ui-two" className='mt-2' onClick={() => CreateLinkEvent('mod-tools/toggle')}>
              <Text variant='white' bold>
                <FaTools style={{ fontSize: '14px', marginRight: '4px', verticalAlign: 'middle' }} />
				<div>Mod tools</div>
              </Text>
            </Button>}
        </div>
      </div>
      <div className='side-toolbar'>
        <div className='side-toolbar-grid'>
          <div className='side-toolbar-container'>
            <div className='mt-2 mb-4' onClick={() => CreateLinkEvent('navigator/toggle')}>
              <div className='text-center'>
                <Base pointer className="navigation-item icon icon-rooms nitro-toolbar-icon nitro-space-right sidebar-navigation-icon" />
              </div>
              <div className='w-100 text-center'>
                <Text variant="white" small bold center>{ LocalizeText('toolbar.icon.label.navigator') }</Text>
              </div>
            </div>
            <div className='mb-4' onClick={() => CreateLinkEvent('catalog/toggle')}>
              <div className='text-center'>
                <Base pointer className="navigation-item icon icon-catalog nitro-toolbar-icon nitro-space-right sidebar-navigation-icon" />
              </div>
              <div className='w-100 text-center'>
                <Text variant="white" small bold center>{ LocalizeText('tooltip.shop') }</Text>
              </div>
            </div>
            <div className='mb-4' onClick={() => CreateLinkEvent('inventory/toggle')}>
              <div className='text-center'>
                <Base pointer className="navigation-item icon icon-inventory nitro-toolbar-icon nitro-space-right sidebar-navigation-icon">
                  {getFullCount > 0 && <LayoutItemCountView count={getFullCount} style={{ top: "190px" }} />}
                </Base>
              </div>
              <div className='w-100 text-center'>
                <Text variant="white" small bold center>{ LocalizeText('toolbar.icon.label.inventory') }</Text>
              </div>
            </div>
            <div className='mb-4' onClick={() => CreateLinkEvent('gamecenter/show')}>
              <div className='text-center'>
                <Base pointer className="navigation-item icon icon-game nitro-toolbar-icon nitro-space-right sidebar-navigation-icon" />
              </div>
              <div className='w-100 text-center'>
                <Text variant="white" small bold center>{ LocalizeText("games.main.title") }</Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideToolbarView;