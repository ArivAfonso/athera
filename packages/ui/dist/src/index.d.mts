import React, { FC, ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, HTMLAttributes } from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';
import { StaticImageData, ImageProps } from 'next/image';
import { Route as Route$1 } from 'next';

interface AccordionItem {
    name: string;
    component: ReactNode;
}
interface Props$3 {
    panelClassName?: string;
    data?: AccordionItem[];
    defaultOpen?: boolean;
}
declare const AccordionInfo: FC<Props$3>;

type AlertType = 'danger' | 'info' | 'success' | 'warning';
interface AlertProps {
    type: AlertType;
    message: string;
}
declare const Alert: React.FC<AlertProps>;

type BadgeColor = 'pink' | 'green' | 'yellow' | 'red' | 'indigo' | 'blue' | 'purple' | 'brown' | 'orange' | 'gray';
interface BadgeProps {
    className?: string;
    name: ReactNode;
    color?: BadgeColor;
    href?: string;
}
declare const Badge: FC<BadgeProps>;

interface ButtonProps {
    className?: string;
    sizeClass?: string;
    fontSize?: string;
    pattern?: 'primary' | 'secondary' | 'third' | 'white' | 'default';
    loading?: boolean;
    disabled?: boolean;
    type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
    href?: string;
    targetBlank?: boolean;
    onClick?: () => void;
    children?: React.ReactNode;
}
declare const Button: FC<ButtonProps>;

interface CheckboxProps {
    label?: string;
    subLabel?: string;
    className?: string;
    name: string;
    defaultChecked?: boolean;
    onChange?: (checked: boolean) => void;
}
declare const Checkbox: FC<CheckboxProps>;

interface DropDownItem<T = string> {
    id: T;
    name: string;
    icon: string;
    href?: string;
    isTargetBlank?: boolean;
}
interface DropDownProps<T> {
    className?: string;
    panelMenusClass?: string;
    triggerIconClass?: string;
    data: DropDownItem<T>[];
    renderTrigger?: () => ReactNode;
    renderItem?: (item: DropDownItem<T>) => JSX.Element;
    title?: string;
    onClick: (item: DropDownItem<T>) => void;
    dropdownItemsClass?: string;
}
declare function DropDown<T>({ className, triggerIconClass, panelMenusClass, dropdownItemsClass, title, renderTrigger, renderItem, data, onClick, }: DropDownProps<T>): react_jsx_runtime.JSX.Element;

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    sizeClass?: string;
    fontClass?: string;
    rounded?: string;
}
declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;

interface ModalProps {
    renderContent: (closeModal: () => void) => ReactNode;
    renderFooter?: (closeModal: () => void) => ReactNode;
    renderTrigger?: (openModal: () => void) => ReactNode;
    enableFooter?: boolean;
    containerClassName?: string;
    contentExtraClass?: string;
    contentPaddingClass?: string;
    triggerText?: ReactNode;
    modalTitle?: ReactNode;
    isOpenProp?: boolean;
    onCloseModal?: () => void;
    leaveAnimationClass?: string;
    initialFocusRef?: React.RefObject<HTMLTextAreaElement | HTMLInputElement>;
}
declare const Modal: FC<ModalProps>;

interface RadioProps {
    className?: string;
    name: string;
    id: string;
    onChange?: (value: string) => void;
    defaultChecked?: boolean;
    sizeClassName?: string;
    label?: string;
}
declare const Radio: FC<RadioProps>;

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    className?: string;
    sizeClass?: string;
}
declare const Select: FC<SelectProps>;

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
}
declare const Textarea: React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<HTMLTextAreaElement>>;

interface AvatarProps {
    containerClassName?: string;
    sizeClass?: string;
    radius?: string;
    imgUrl?: string | StaticImageData;
    userName?: string;
}
declare const Avatar: FC<AvatarProps>;

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
    fontClass?: string;
    desc?: ReactNode;
    isCenter?: boolean;
}
declare const Heading: React.FC<HeadingProps>;

interface ImgProps extends ImageProps {
    containerClassName?: string;
}
declare const Img: FC<ImgProps>;

interface MySwitchProps {
    enabled?: boolean;
    label?: string;
    desc?: string;
    className?: string;
    onChange?: (enabled: boolean) => void;
    size?: 'small' | 'medium' | 'large';
}
declare const MySwitch: FC<MySwitchProps>;

interface LabelProps {
    className?: string;
    children: React.ReactNode;
}
declare const Label: FC<LabelProps>;

interface Props$2 extends ButtonProps {
}
declare const ButtonPrimary: FC<Props$2>;

interface Props$1 extends ButtonProps {
}
declare const ButtonSecondary: FC<Props$1>;

interface ButtonCircleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    size?: string;
}
declare const ButtonCircle: React.FC<ButtonCircleProps>;

interface Props extends ButtonProps {
}
declare const ButtonThird: FC<Props>;

declare const Loading: () => react_jsx_runtime.JSX.Element;

interface ButtonCloseProps {
    className?: string;
    onClick?: () => void;
    iconSize?: string;
}
declare const ButtonClose: React.FC<ButtonCloseProps>;

interface Heading2Props extends HTMLAttributes<HTMLHeadingElement> {
    emoji?: string;
}
declare const Heading2: React.FC<Heading2Props>;

type Route<T = string> = Route$1<string>;
interface MyLinkProps {
    className?: string;
    colorClass?: string;
    href: Route;
    children: ReactNode;
}
declare const MyLink: FC<MyLinkProps>;

interface PlaceIconProps {
    fill?: string;
}
declare const PlaceIcon: React.FC<PlaceIconProps>;

interface NavProps {
    containerClassName?: string;
    className?: string;
    children: React.ReactNode;
}
declare const Nav: FC<NavProps>;

interface NavItemProps {
    className?: string;
    radius?: string;
    onClick?: () => void;
    isActive?: boolean;
    renderX?: ReactNode;
    children?: ReactNode;
}
declare const NavItem: FC<NavItemProps>;

export { AccordionInfo, Alert, Avatar, Badge, Button, ButtonCircle, ButtonClose, ButtonPrimary, type ButtonProps, ButtonSecondary, ButtonThird, Checkbox, DropDown, type DropDownItem, Heading, Heading2, Img as Image, Img, Input, Label, Loading, Modal, MyLink, MySwitch, Nav, NavItem, PlaceIcon, Radio, Select, Textarea };
