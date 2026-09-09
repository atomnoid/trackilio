'use client';

import React, { useState } from 'react';
import { UserPlusIcon, SettingsIcon } from '@/components/icons/Icons';
import { SaveListButton } from './SaveListButton';
import { ShareButton } from '@/components/ui/ShareButton';
import { QuickInviteModal } from './QuickInviteModal';
import { EditListModal } from './EditListModal';

interface ListHeaderActionsProps {
  listId: string;
  listTitle: string;
  listDescription?: string | null;
  listDestination?: string | null;
  isOwner: boolean;
  canEdit?: boolean;
  isPublic: boolean;
  initialSaved?: boolean;
}

export function ListHeaderActions({
  listId,
  listTitle,
  listDescription,
  listDestination,
  isOwner,
  canEdit = false,
  isPublic,
  initialSaved = false,
}: ListHeaderActionsProps) {
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 shrink-0">
        {/* Save List Button — Prominent and accessible */}
        <SaveListButton listId={listId} initialSaved={initialSaved} />

        {/* Top Add Collaborator Button (For List Owners) */}
        {isOwner && (
          <button
            onClick={() => setInviteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-[#FFEAE6] hover:bg-[#FFDCD6] border border-[#FFD3CC] text-[#FF5841] text-xs font-black shadow-2xs active-press transition-all"
          >
            <UserPlusIcon className="h-3.5 w-3.5" />
            <span>+ Add Collaborator</span>
          </button>
        )}

        {/* Edit & Settings Button (For Owners / Editors) */}
        {(isOwner || canEdit) && (
          <button
            onClick={() => setEditModalOpen(true)}
            title="Edit list details & settings"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold shadow-2xs active-press transition-all"
          >
            <SettingsIcon className="h-3.5 w-3.5 text-gray-500" />
            <span>Edit List</span>
          </button>
        )}

        {/* Share Button */}
        {isPublic && <ShareButton title={listTitle} />}
      </div>

      {isOwner && (
        <QuickInviteModal
          listId={listId}
          isOpen={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
        />
      )}

      {(isOwner || canEdit) && (
        <EditListModal
          listId={listId}
          initialTitle={listTitle}
          initialDescription={listDescription}
          initialDestination={listDestination}
          initialIsPublic={isPublic}
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
        />
      )}
    </>
  );
}
