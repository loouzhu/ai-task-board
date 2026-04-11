import AuthForm from '@/pages/Auth/AuthForm'
import styles from "./index.module.less";

export default function Auth() {
  return (
    <div className={styles.auth}>
      <AuthForm />
    </div>
  )
}
