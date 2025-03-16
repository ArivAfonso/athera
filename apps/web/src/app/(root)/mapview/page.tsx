'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMapEvents,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import NewsType from '@/types/NewsType'
import { createClient } from '@/utils/supabase/client'
import { useThemeMode } from '@/hooks/useThemeMode'

// Fetch news within the current map bounds by calling a custom RPC.
// (min_lon, min_lat, max_lon, max_lat, limit) and returns matching news.
const fetchNewsWithinBounds = async (
    bounds: L.LatLngBounds
): Promise<NewsType[]> => {
    const ne = bounds.getNorthEast()
    const sw = bounds.getSouthWest()

    const supabase = createClient()

    const { data, error } = await supabase.rpc('news_in_view', {
        min_long: sw.lng,
        min_lat: sw.lat,
        max_long: ne.lng,
        max_lat: ne.lat,
        limit_count: 100,
    })

    console.log('data:', data)

    if (error) {
        console.error('Error fetching news within bounds:', error)
        return []
    }
    return data as NewsType[]
}

// Component that attaches a moveend event listener to update bounds
const MapEvents = ({
    onBoundsChange,
}: {
    onBoundsChange: (bounds: L.LatLngBounds) => void
}) => {
    useMapEvents({
        moveend: (e) => {
            const map = e.target
            onBoundsChange(map.getBounds())
        },
    })
    return null
}

const getIcon = () =>
    new L.Icon({
        iconUrl: `${window.location.origin}/marker.png`,
        iconSize: [15, 15],
    })

const NewsMap: React.FC = () => {
    const [news, setNews] = useState<NewsType[]>([])
    const [bounds, setBounds] = useState<L.LatLngBounds | null>(null)
    const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
        null
    )

    const themeInitial = useThemeMode()

    const [theme, setTheme] = useState(themeInitial)

    useEffect(() => {
        setTheme(themeInitial)
    }, [themeInitial])

    const handleBoundsChange = useCallback((newBounds: L.LatLngBounds) => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current)
        }
        debounceTimeoutRef.current = setTimeout(() => {
            setBounds(newBounds)
        }, 500) // 500ms debounce delay; adjust as needed
    }, [])

    useEffect(() => {
        if (bounds) {
            fetchNewsWithinBounds(bounds).then((data) => {
                setNews(data)
            })
        }
    }, [bounds])

    return (
        <MapContainer
            center={[0, 0]}
            zoom={2}
            style={{ height: '100vh', width: '100%' }}
            className="z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url={`https://{s}.basemaps.cartocdn.com/${theme.isDarkMode ? 'dark' : 'light'}_all/{z}/{x}/{y}{r}.png`}
                subdomains="abcd"
                maxZoom={20}
            />
            <MapEvents onBoundsChange={handleBoundsChange} />
            {news[0] &&
                news.map((n) => (
                    <Marker
                        icon={getIcon()}
                        key={n.id}
                        position={[n.lat, n.long]}
                    >
                        <Popup>
                            <div>
                                <h3>{n.title}</h3>
                                <p>{n.summary}</p>
                                <a
                                    href={n.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Read more
                                </a>
                            </div>
                        </Popup>
                    </Marker>
                ))}
        </MapContainer>
    )
}

export default NewsMap
