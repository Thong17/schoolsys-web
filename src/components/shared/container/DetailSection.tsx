import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { TextEllipsis } from '../TextEllipsis'

export const DetailSection = ({ title, data, icon, action }: any) => {
  const { theme } = useTheme()
  const { device } = useWeb()

  return (
    <div
      style={{
        backgroundColor: theme.background.secondary,
        width: 'fit-content',
        minWidth: 200,
        height: 100,
        borderRadius: theme.radius.secondary,
        padding: 15,
        boxSizing: 'border-box',
        boxShadow: theme.shadow.container,
        position: 'relative'
      }}
    >
      <TextEllipsis style={{ fontSize: theme.responsive[device]?.text.primary, color: theme.text.secondary }}>
        {title}
      </TextEllipsis>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {icon && <div style={{ marginRight: 10 }}>{icon}</div>}
        <TextEllipsis style={{ fontSize: theme.responsive[device]?.text.h1, color: theme.text.primary }}>{data}</TextEllipsis>
      </div>
      {action && <div style={{ position: 'absolute', right: 10, bottom: 10 }}>{action}</div>}
    </div>
  )
}
