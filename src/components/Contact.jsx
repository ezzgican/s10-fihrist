import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

export default function Contact() {

   const queryClient = useQueryClient();
   const history = useHistory()
  
 const { contactId } = useParams();

 const { data, isLoading } = useQuery({
  queryKey: ['contact', contactId],
  queryFn: async () => {
    const res= await axios.get( `https://688247fb66a7eb81224e18ff.mockapi.io/fihrist/api/contact/${contactId}`);
    return res.data;
  },
  enabled: !!contactId
 })

const contact = data;


 const deleteContact = useMutation({
  mutationFn: (id) => 
    axios.delete(`https://688247fb66a7eb81224e18ff.mockapi.io/fihrist/api/contact/${contactId}`
),
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: ['contacts'] })
    history.push("/");
  }
 })

 if (isLoading) return <p>Yükleniyor...</p>;
  if (!contact) return <p>Kişi bulunamadı</p>;


  return (
    <div id="contact" className="max-w-2xl flex gap-8 items-center">
      <div>
        <img
          key={contact.avatar}
          src={contact.avatar || null}
          className="w-48 h-48 bg-[#c8c8c8] rounded-3xl object-cover"
        />
      </div>

      <div className="flex-1">
        <h1
          data-testid="full_name"
          className="text-3xl font-bold m-0 leading-tight"
        >
          {contact.first_name || contact.last_name ? (
            <>
              {contact.first_name} {contact.last_name}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
        </h1>

        {contact.email && (
          <p className="m-0">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`mailto:${contact.email}`}
            >
              {contact.email}
            </a>
          </p>
        )}

        <div className="mt-6">
          <button className="text-red-500" onClick={() => deleteContact.mutate(contact.id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
