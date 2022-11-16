import { createContext, useState } from 'react'

interface IConfig {
  sidebar: boolean,
  display: 'grid' | 'list'
  tabs: string[]
}

const initState: IConfig = {
  sidebar: localStorage.getItem('setting-sidebar') === 'true' ? true : false,
  display: localStorage.getItem('setting-display') === 'list' ? 'list' : 'grid',
  tabs: JSON.parse(localStorage.getItem('setting-tabs') || '[]'),
}
export const ConfigContext = createContext({
  ...initState,
  toggleSidebar: () => {},
  toggleDisplay: (display) => {},
  resetTabs: (tabs) => {},
})

const ConfigProvider = ({ children }) => {
  const [sidebar, setSidebar] = useState(initState.sidebar)
  const [display, setDisplay] = useState<'grid' | 'list'>(initState.display)
  const [tabs, setTabs] = useState<string[]>(initState.tabs)

  const toggleSidebar = () => {
    const toggleSidebar = !sidebar
    setSidebar(toggleSidebar)
    localStorage.setItem('setting-sidebar', toggleSidebar ? 'true' : 'false')
  }

  const toggleDisplay = (display) => {
    setDisplay(display)
    localStorage.setItem('setting-display', display)
  }

  const resetTabs = (tabs) => {
    setTabs(tabs)
    localStorage.setItem('setting-tabs', JSON.stringify(tabs))
  }

  return (
    <ConfigContext.Provider value={{ sidebar, display, tabs, toggleSidebar, toggleDisplay, resetTabs }}>
      {children}
    </ConfigContext.Provider>
  )
}

export default ConfigProvider
