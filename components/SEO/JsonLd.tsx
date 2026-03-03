import React from 'react';

export default function JsonLd() {
    const educationalOrganization = {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": "PYQ’s Hub",
        "url": "https://pyqs-hub.vercel.app",
        "logo": "https://pyqs-hub.vercel.app/assets/icon_light.png",
        "description": "Industrial academic archive for VIT-AP engineering students provides CAT-1, CAT-2, and FAT previous year question papers.",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Amaravati",
            "addressRegion": "Andhra Pradesh",
            "addressCountry": "IN"
        },
        "sameAs": [
            "https://twitter.com/pyqshub",
            "https://github.com/Naein19/PYQ-S-HUB"
        ]
    };

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "PYQ’s Hub",
        "url": "https://pyqs-hub.vercel.app",
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://pyqs-hub.vercel.app/explore?search={search_term_string}"
            },
            "query-input": "required name=search_term_string"
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(educationalOrganization) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
        </>
    );
}
