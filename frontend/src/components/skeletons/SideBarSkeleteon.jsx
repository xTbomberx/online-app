import React from 'react'

import './css/skeleton.css'


function SideBarSkeleteon() {

    const skeletonContacts = Array(8).fill(null)

  return (
        <div>
            {/* Header */}
            <div className="header">
                <span>Contacts</span>
            </div>

            {/* Skeleton-Contacts */}
            {skeletonContacts.map((_, idx) => (
                <div key={idx} className="skeleton-contact"></div>
            ))}
        </div>
  )
}

export default SideBarSkeleteon