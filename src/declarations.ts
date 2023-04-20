declare module '*.jpg';
declare module '*.png';

interface Window {
    dataLayer: {
        push: ({}) => void
    }
}