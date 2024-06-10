import React from 'react';
import { ReactComponent as ArrowLeftSharpIcon } from '../icons/arrow-left-sharp.svg';
import { ReactComponent as ArrowRightSharpIcon } from '../icons/arrow-right-sharp.svg';
import { ReactComponent as CopyIcon } from '../icons/copy.svg';
import { ReactComponent as VolumeUpIcon } from '../icons/volume-up.svg';
import { ReactComponent as EditIcon } from '../icons/edit.svg';
import { ReactComponent as MenuBurgerIcon } from '../icons/menu-burger.svg';
import { ReactComponent as SoundIcon } from '../icons/sound.svg';
import { ReactComponent as PencilIcon } from '../icons/pencil.svg';
import { ReactComponent as PauseIcon } from '../icons/pause.svg';
import { ReactComponent as PlayIcon } from '../icons/play.svg';
import { ReactComponent as FocusIcon } from '../icons/focus.svg';

const icons = {
    'arrow-left-sharp': ArrowLeftSharpIcon,
    'arrow-right-sharp': ArrowRightSharpIcon,
    'copy': CopyIcon,
    'volume-up': VolumeUpIcon,
    'edit': EditIcon,
    'menu-burger': MenuBurgerIcon,
    'sound': SoundIcon,
    'pencil': PencilIcon,
    'play': PlayIcon,
    'pause': PauseIcon,
    'focus': FocusIcon,
    // добавьте остальные иконки сюда
};

interface IconProps {
    name: 'arrow-left-sharp' | 'arrow-right-sharp' | 'copy' | 'volume-up' | 'edit' | 'menu-burger' | 'sound' | 'pencil' | 'play' | 'pause' | 'focus';
    size?: number;
}

const Icon = (props: IconProps) => {
    const { name, size = 16 } = props;
    const SvgIcon = icons[name];

    if (!SvgIcon) {
        return null; // или можно вернуть иконку-заглушку
    }

    return <SvgIcon width={size} height={size} {...props} />;
};

export default Icon;
