import BrandingPanel from "../_components/BrandingPanel"
import VerifyEmail from "../_components/verify-email"

const VerifyEmailPage = () => {
    return (
        <div className="h-screen flex bg-gray-50 fixed w-screen overflow-hidden">
            <BrandingPanel />
            <div className="flex-1 h-screen overflow-y-auto">
                <div className="min-h-full flex items-center justify-center p-6 lg:p-12">
                    <VerifyEmail />
                </div>
            </div>
        </div>
    )
}

export default VerifyEmailPage
