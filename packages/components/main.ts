
export { default as OarButton } from './button';



export type ComponentsType = {
    [key: string]: typeof import('./button').default;
}