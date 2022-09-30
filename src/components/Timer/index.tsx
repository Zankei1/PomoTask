import { useState } from "react";
import { Countdown } from "./Countdown";
import { BsArrowRight } from "react-icons/bs";
import * as Tabs from "@radix-ui/react-tabs";
import styles from "./styles.module.css";

interface TimerProps {
  isSidebarOpen: boolean;
  onOpenSidebar: () => void;
}

export function Timer({ onOpenSidebar, isSidebarOpen }: TimerProps) {
  const [selectedTab, setSelectedTab] = useState("tab1");

  return (
    <div className={styles.container}>
      <div className={styles.timerHeader}>
        {!isSidebarOpen && (
          <button
            aria-label="botão para fechar a sidebar"
            className={styles.openSidebar}
            onClick={onOpenSidebar}
          >
            <BsArrowRight fontSize={26} />
          </button>
        )}
        <h2>Timer</h2>
      </div>
      <Tabs.Root
        className={styles.tabsContainer}
        defaultValue={"tab1"}
        onValueChange={(value: string) => setSelectedTab(value)}
      >
        <Tabs.List className={styles.tabsList}>
          <Tabs.Trigger className={styles.timerTab} value="tab1">
            Pomodoro
          </Tabs.Trigger>
          <Tabs.Trigger className={styles.timerTab} value="tab2">
            Break
          </Tabs.Trigger>
          <Tabs.Trigger className={styles.timerTab} value="tab3">
            Long Break
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className={styles.tabContent} value="tab1">
          <Countdown selectedTab={selectedTab} />
        </Tabs.Content>
        <Tabs.Content className={styles.tabContent} value="tab2">
          <Countdown selectedTab={selectedTab} />
        </Tabs.Content>
        <Tabs.Content className={styles.tabContent} value="tab3">
          <Countdown selectedTab={selectedTab} />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
