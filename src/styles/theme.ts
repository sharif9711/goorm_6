import { theme } from 'antd'
import type { ThemeConfig } from 'antd'

const sharedToken = {
  colorPrimary: '#5B6CFF',
  colorInfo: '#5B6CFF',
  colorSuccess: '#22C55E',
  colorWarning: '#F59E0B',
  colorError: '#EF4444',
  borderRadius: 10,
  borderRadiusLG: 16,
  fontFamily:
    "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  fontSize: 14,
  controlHeight: 40,
  wireframe: false,
}

export function getAppTheme(mode: 'light' | 'dark'): ThemeConfig {
  const isDark = mode === 'dark'

  return {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      ...sharedToken,
      colorBgLayout: isDark ? '#0F1117' : '#EEF1F8',
      colorBgContainer: isDark ? '#1A1D27' : '#FFFFFF',
      colorBgElevated: isDark ? '#222633' : '#FFFFFF',
      colorBorderSecondary: isDark ? '#2E3344' : '#E8ECF4',
      colorText: isDark ? '#F3F4F8' : '#1A1D26',
      colorTextSecondary: isDark ? '#9CA3B8' : '#5C6478',
    },
    components: {
      Layout: {
        headerBg: isDark ? '#1A1D27' : '#FFFFFF',
        siderBg: isDark ? '#14171F' : '#FFFFFF',
        bodyBg: isDark ? '#0F1117' : '#EEF1F8',
      },
      Menu: {
        itemBorderRadius: 10,
        itemHeight: 44,
        iconSize: 16,
        itemMarginInline: 8,
        itemMarginBlock: 4,
        itemSelectedBg: isDark ? 'rgba(91, 108, 255, 0.2)' : 'rgba(91, 108, 255, 0.1)',
        itemSelectedColor: '#5B6CFF',
        itemHoverBg: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(91, 108, 255, 0.06)',
        groupTitleColor: isDark ? '#6B7288' : '#8B93A7',
        groupTitleFontSize: 11,
      },
      Card: {
        borderRadiusLG: 16,
        paddingLG: 20,
        boxShadowTertiary: isDark
          ? '0 4px 24px rgba(0,0,0,0.35)'
          : '0 4px 24px rgba(26, 29, 38, 0.06)',
      },
      Button: {
        borderRadius: 10,
        primaryShadow: '0 4px 14px rgba(91, 108, 255, 0.35)',
      },
      Input: {
        borderRadius: 10,
        activeShadow: '0 0 0 2px rgba(91, 108, 255, 0.15)',
      },
      Table: {
        borderRadius: 12,
        headerBg: isDark ? '#222633' : '#F7F8FC',
      },
    },
  }
}
