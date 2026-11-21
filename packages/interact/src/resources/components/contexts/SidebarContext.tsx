import {useMediaQuery} from "@/hooks/useMediaQuery";
import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";

interface SidebarContextValue {
    isOpen: boolean;
    /**
     * Show the sidebar in an off canvas
     */
    isOffCanvas: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
    setIsOpen: (value: boolean) => void;
}

const SidebarProviderContext = createContext<SidebarContextValue|undefined>(undefined);

interface SidebarProviderProps {
    children: ReactNode;
    defaultOpen?: boolean;
}

export function useSidebar(): SidebarContextValue {
    const context = useContext(SidebarProviderContext);
    if (context === undefined) {
        throw new Error("useSidebar must be used within a SidebarContext");
    }
    return context;
}

export default function SidebarContext({
                                           children,
                                           defaultOpen = false,
                                       }: SidebarProviderProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    const toggle = useCallback(() => setIsOpen((prev) => {
        console.log("toggle" + !prev);
        return !prev;
    }), []);

    // Why Media Query and not CSS?
    // To not mount the Aside children twice (desktop + mobile).
    // If you only use CSS to switch layouts, both trees are mounted, so a child in a sidebar
    // such as a SearchBox with a key binding would be registered and shown twice when the component is mounted
    const isOffCanvas = useMediaQuery("(max-width: 768px)");

    const value = useMemo(
        () => ({isOpen, isOffCanvas, open, close, toggle, setIsOpen}),
        [isOpen, isOffCanvas, open, close, toggle]
    );

    return (
        <SidebarProviderContext.Provider value={value}>{children}</SidebarProviderContext.Provider>
    );
}
