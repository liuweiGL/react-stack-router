import { ProviderProps } from 'react';
import { Location } from 'history';
declare type LocationContextState = {
    location: Location;
};
export declare const LocationContext: import("react").Context<LocationContextState>;
export declare const LocationProvider: (props: ProviderProps<LocationContextState>) => JSX.Element;
export {};
