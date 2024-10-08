import { FolderButton } from "@components/FolderButton";
import { Modal } from "@components/Modal";
import { ScrollArea } from "@components/ScrollArea";
import { ShortcutsHelp } from "@components/ShortcutsHelp";
import { FloatingDelayGroup } from "@floating-ui/react";
import { useHotkeys } from "@utils/hooks";
import { useBrowserStorageValue } from "@utils/storage/api";
import { Folder } from "@utils/user-data/types";
import { AnimatePresence } from "framer-motion";
import { lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import './Sidebar.scss';
import clsx from "clsx";



const SettingsModal = lazy(() => import('../settings/Settings').then(m => ({ 'default': m.SettingsModal })));

export type SidebarProps = {
    folders: Folder[],
    activeFolder: Folder,
    orientation: 'vertical' | 'horizontal',
    onFolderClick: (folder: Folder) => void;
}

export const Sidebar = ({ folders, activeFolder, orientation, onFolderClick }: SidebarProps) => {
    const { t } = useTranslation();
    const [hasUnreadReleaseNotes, setHasUnreadReleaseNotes] = useBrowserStorageValue('hasUnreadReleaseNotes', false);
    const [autoHideSidebar] = useBrowserStorageValue('autoHideSidebar', false);
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [shortcutsHelpVisible, setShortcutsHelpVisible] = useState(false);


    useHotkeys('alt+h', () => setShortcutsHelpVisible(v => !v));
    useHotkeys('alt+s', () => setSettingsVisible(v => !v));


    return (<>
        <div className={clsx('sidebar-wrapper', autoHideSidebar && 'sidebar-autohide')}>
            <ScrollArea
                className="sidebar"
                contentClassName='sidebar-viewport'
                color='translucent'
                type='hover'
                direction={orientation}
                mirrorVerticalScrollToHorizontal
            >
                <div className="sidebar-content">
                    <FloatingDelayGroup delay={{ open: 50, close: 50 }}>
                        {folders.map(f => {
                            return (<FolderButton
                                dropDestination={{ id: f.id }}
                                sidebarOrientation={orientation}
                                key={f.id}
                                icon={f.icon}
                                name={f.name}
                                active={activeFolder === f}
                                onClick={() => {
                                    onFolderClick(f);
                                }}
                            />);
                        })}
                        <div className="spacer" />
                        <FolderButton
                            sidebarOrientation={orientation}
                            layoutId='settings'
                            icon="ion:settings-sharp"
                            name={t('settings.title')}
                            onClick={() => setSettingsVisible(true)}
                        />
                    </FloatingDelayGroup>
                </div>
            </ScrollArea>
        </div>

        <AnimatePresence>
            {shortcutsHelpVisible && <Modal title={t('shortcuts.title')} closable onClose={() => setShortcutsHelpVisible(false)}>
                <ShortcutsHelp />
            </Modal>}
        </AnimatePresence>

        <Suspense fallback={undefined}>
            <AnimatePresence>
                {settingsVisible && <SettingsModal onClose={() => setSettingsVisible(false)} />}
            </AnimatePresence>
        </Suspense>
    </>);
};