import React from "react";
import Input from "@/components/Input/Input";
import ButtonPrimary from "@/components/Button/ButtonPrimary";
import Select from "@/components/Select/Select";
import Label from "@/components/Label/Label";

const page = () => {
  return (
    <div className="rounded-xl md:border md:border-neutral-100 dark:border-neutral-800 md:p-6">
      <form className="grid md:grid-cols-2 gap-6" action="#" method="post">
        <label className="block">
          <Label>Country</Label>
          <Select className="mt-1">
            <option>United States</option>
            <option>Canada</option>
            <option>Mexico</option>
            <option>VietNam</option>
            <option>Japan</option>
          </Select>
        </label>
        <label className="block">
          <Label>State/Province/Region *</Label>

          <Select className="mt-1">
            <option value="ha'apai">{`Ha'apai`}</option>
            <option value="tongatapu">Tongatapu</option>
            <option value="vava'u">{`Vava'u`}</option>
          </Select>
        </label>
        <label className="block">
          <Label>Address Line 1 *</Label>

          <Input type="text" className="mt-1" />
        </label>
        <label className="block">
          <Label>Address Line 2</Label>

          <Input type="text" className="mt-1" />
        </label>
        <label className="block">
          <Label>City *</Label>

          <Input type="text" className="mt-1" />
        </label>
        <label className="block">
          <Label>Postal/ZIP Code *</Label>

          <Input type="text" className="mt-1" />
        </label>
        <ButtonPrimary className="md:col-span-2" type="submit">
          Update Billing address
        </ButtonPrimary>
      </form>
    </div>
  );
};

export default page;
