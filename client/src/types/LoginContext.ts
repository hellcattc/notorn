import { NavigateFunction } from 'react-router-dom'

export interface LoginContext {
  rerouteRef: React.MutableRefObject<NavigateFunction>
  rerouteOnContext: () => void
}
