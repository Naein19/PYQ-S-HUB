import React from 'react';

export default function JsonLd() {
    const brandName = "PYQ’s Hub";
    const baseUrl = "https://pyqs-hub.vercel.app";

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": brandName,
        "url": baseUrl,
        "logo": `${baseUrl}/apple-touch-icon.png`,
        "description": "The premier academic archive for VIT-AP students. Access CAT-1, CAT-2, and FAT previous year question papers.",
        "sameAs": [
            "https://twitter.com/pyqshub",
            "https://github.com/Naein19/PYQ-S-HUB"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "technical support",
            "email": "support@pyqshub.vercel.app"
        }
    };

    const educationalOrganization = {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": brandName,
        "url": baseUrl,
        "logo": `${baseUrl}/assets/icon_light.png`,
        "description": "Industrial academic archive for VIT-AP engineering students providing CAT-1, CAT-2, and FAT papers.",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Amaravati",
            "addressRegion": "Andhra Pradesh",
            "addressCountry": "IN"
        }
    };

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": brandName,
        "url": baseUrl,
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${baseUrl}/explore?search={search_term_string}`
            },
            "query-input": "required name=search_term_string"
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
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
