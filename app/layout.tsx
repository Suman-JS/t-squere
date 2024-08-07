import ConnectivityBanner from "@/components/ConectivityBanner";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { RegisterSW } from "@/components/RegisterSW";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
    weight: "300",
    fallback: ["system-ui", "arial"],
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "T-Square",
    description:
        "Unlock the power of communication with T-Squere! We specialize in high-quality translation, transcription, data collection, and survey services tailored to meet your unique needs. Our expert team ensures accuracy, reliability, and timely delivery, empowering your projects with valuable insights and seamless connections. Partner with us today for exceptional service and results!",
};

const RootLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <html lang="en" suppressHydrationWarning>
            <head />
            <body className={`${roboto.className} relative`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <ConnectivityBanner />
                    <RegisterSW />
                </ThemeProvider>
            </body>
        </html>
    );
};
export default RootLayout;
