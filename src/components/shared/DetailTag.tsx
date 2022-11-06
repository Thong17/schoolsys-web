import useTheme from "hooks/useTheme"
import useWeb from "hooks/useWeb"

export const DetailTag = ({ label, value }) => {
    const { theme } = useTheme()
    const { device } = useWeb()
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 100 }}>
        <span
          style={{
            color: theme.text.quaternary,
            fontSize: theme.responsive[device].text.quaternary,
          }}
        >
          {label}
        </span>
        <span style={{ color: theme.text.secondary, fontSize: theme.responsive[device].text.h5 }}>{value}</span>
      </div>
    )
  }