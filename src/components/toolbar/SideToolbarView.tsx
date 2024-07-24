import { Dispose, DropBounce, EaseOut, ILinkEventTracker, JumpBy, Motions, NitroToolbarAnimateIconEvent, PerkAllowancesMessageEvent, PerkEnum, Queue, Wait } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { AddEventLinkTracker, CreateLinkEvent, GetSessionDataManager, MessengerIconState, RemoveLinkEventTracker, VisitDesktop } from '../../api';
import { Base, Button, LayoutItemCountView, Text } from '../../common';
import { useAchievements, useFriends, useInventoryUnseenTracker, useIsPlaying, useMessageEvent, useMessenger, useRoomEngineEvent, useSessionInfo } from '../../hooks';

const SideToolbarView: FC<{ isInRoom: boolean }> = props =>
{

  const { isInRoom } = props;
  const [isMeExpanded, setMeExpanded] = useState(false);
  const [useGuideTool, setUseGuideTool] = useState(false);
  const { userFigure = null } = useSessionInfo();
  const { getFullCount = 0 } = useInventoryUnseenTracker();
  const { getTotalUnseen = 0 } = useAchievements();
  const { requests = [] } = useFriends();
  const { iconState = MessengerIconState.HIDDEN } = useMessenger();
  const isMod = GetSessionDataManager().isModerator;

  // 
  const [isVisible, setIsVisible] = useState(true);
  const { isPlaying } = useIsPlaying();

  useMessageEvent<PerkAllowancesMessageEvent>(PerkAllowancesMessageEvent, event =>
  {
    const parser = event.getParser();

    setUseGuideTool(parser.isAllowed(PerkEnum.USE_GUIDE_TOOL));
  });

  useRoomEngineEvent<NitroToolbarAnimateIconEvent>(NitroToolbarAnimateIconEvent.ANIMATE_ICON, event =>
  {
    const animationIconToToolbar = (iconName: string, image: HTMLImageElement, x: number, y: number) =>
    {
      const target = (document.body.getElementsByClassName(iconName)[0] as HTMLElement);

      if (!target) return;

      image.className = 'toolbar-icon-animation';
      image.style.visibility = 'visible';
      image.style.left = (x + 'px');
      image.style.top = (y + 'px');

      document.body.append(image);

      const targetBounds = target.getBoundingClientRect();
      const imageBounds = image.getBoundingClientRect();

      const left = (imageBounds.x - targetBounds.x);
      const top = (imageBounds.y - targetBounds.y);
      const squared = Math.sqrt(((left * left) + (top * top)));
      const wait = (500 - Math.abs(((((1 / squared) * 100) * 500) * 0.5)));
      const height = 20;

      const motionName = (`ToolbarBouncing[${iconName}]`);

      if (!Motions.getMotionByTag(motionName))
      {
        Motions.runMotion(new Queue(new Wait((wait + 8)), new DropBounce(target, 400, 12))).tag = motionName;
      }

      const motion = new Queue(new EaseOut(new JumpBy(image, wait, ((targetBounds.x - imageBounds.x) + height), (targetBounds.y - imageBounds.y), 100, 1), 1), new Dispose(image));

      Motions.runMotion(motion);
    }

    animationIconToToolbar('icon-inventory', event.image, event.x, event.y);
  });

  useEffect(() =>
  {
    const linkTracker: ILinkEventTracker = {
      linkReceived: (url: string) =>
      {
        const parts = url.split('/');

        if (parts.length < 2) return;

        switch (parts[1])
        {
          case 'show':
            setIsVisible(true);
            return;
          case 'hide':
            setIsVisible(false);
            return;
          case 'toggle':
            setIsVisible(prevValue => !prevValue);
            return;
        }
      },
      eventUrlPrefix: 'toolbar-view/'
    };

    AddEventLinkTracker(linkTracker);

    return () => RemoveLinkEventTracker(linkTracker);
  }, []);

  return (
    <>
      <div className="side-toolbar-upside">
        <div className='mt-2'>
          {isInRoom &&
            <Button variant="primary-ui-two" onClick={event => VisitDesktop()} >
              <Text variant='white' bold>
                <i className="fas fa-long-arrow-left"></i>&nbsp;
                Hotel view
              </Text>
            </Button>}
          {!isInRoom &&
            <Button variant="primary-ui-two" onClick={event => CreateLinkEvent('navigator/goto/home')} >
              <Text variant='white' bold>
                <i className="fas fa-home"></i>&nbsp;
                Home
              </Text>
            </Button>}
          {isMod && <Button variant="primary-ui-two" className='mt-2' onClick={event => CreateLinkEvent('mod-tools/toggle')} >
            <Text variant='white' bold>
              <i className="fas fa-clipboard-user"></i>&nbsp;
              Mod tools
            </Text>
          </Button>}
        </div>
      </div>
      <div className='side-toolbar'>
        <div className='side-toolbar-grid'>
          <div className='side-toolbar-container'>
            <div className='mt-2 mb-4' onClick={event => CreateLinkEvent('navigator/toggle')}>
              <div className='text-center'>
                <Base pointer className="navigation-item icon icon-rooms nitro-toolbar-icon nitro-space-right sidebar-navigation-icon" />
              </div>
              <div className='w-100 text-center'>
                <Text variant="white" small bold center>Navegador</Text>
              </div>
            </div>
            <div className='mb-4' onClick={event => CreateLinkEvent('catalog/toggle')}>
              <div className='text-center'>
                <Base pointer className="navigation-item icon icon-catalog nitro-toolbar-icon nitro-space-right sidebar-navigation-icon" />
              </div>
              <div className='w-100 text-center'>
                <Text variant="white" small bold center>Catálogo</Text>
              </div>
            </div>
            <div className='mb-4' onClick={event => CreateLinkEvent('inventory/toggle')}>
              <div className='text-center'>
                <Base pointer className="navigation-item icon icon-inventory nitro-toolbar-icon nitro-space-right sidebar-navigation-icon">
                  {(getFullCount > 0) &&
                    <LayoutItemCountView count={getFullCount} style={{ top: "190px" }} />}
                </Base>
              </div>
              <div className='w-100 text-center'>
                <Text variant="white" small bold center>Inventario</Text>
              </div>
            </div>
            <div className='mb-4' onClick={event => CreateLinkEvent('gamecenter/show')} >
              <div className='text-center'>
                <Base pointer className="navigation-item icon icon-game nitro-toolbar-icon nitro-space-right sidebar-navigation-icon" />
              </div>
              <div className='w-100 text-center'>
                <Text variant="white" small bold center>Game center</Text>
              </div>
            </div>
            <div className='mb-2' onClick={event => CreateLinkEvent('battlepass/toggle')}>
              <div className='text-center'>
                <Base pointer className="navigation-item icon icon-battle nitro-toolbar-icon nitro-space-right sidebar-navigation-icon" />
              </div>
              <div className='w-100 text-center'>
                <Text variant="white" small bold center>Battle pass</Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SideToolbarView
