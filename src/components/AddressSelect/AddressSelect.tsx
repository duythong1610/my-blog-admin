import { Select } from "antd";
import { FormInstance } from "antd/es/form/Form";
import { Rule } from "antd/lib/form";
import FormItem from "antd/lib/form/FormItem";
import { useAddress } from "hooks/useAddress";
import { toJS } from "mobx";
import React, { useEffect, useImperativeHandle, useState } from "react";
import { AddressData, City, District, Ward } from "types/address";
import { Order } from "types/order";

const rules: Rule[] = [{ required: true }];

export interface AddressParam {
  parentCode?: string;
}

export interface AddressSelect {
  setValue: (data: IAddress) => void;
}

export interface IAddress {
  district: District;
  city: City;
  ward: Ward;

  // address: string;
}

export const AddressSelect = React.forwardRef(
  (
    {
      form,
      onChange,
    }: {
      form: FormInstance<any>;
      onChange: (data: any) => void;
    },
    ref
  ) => {
    const [queryWard, setQueryWard] = useState<AddressParam>();
    const [queryDistrict, setQueryDistrict] = useState<AddressParam>();

    useImperativeHandle(
      ref,
      () => {
        return {
          setValue(data: IAddress) {
            if (data.ward) {
              updateWard([...wards, data.ward]);
            }
            if (data.city) {
              updateCity([...cities, data.city]);
            }
            if (data.district) {
              updateDistrict([...districts, data.district]);
            }

            form.setFieldsValue({
              cityId: data?.city?.id,
              wardId: data?.ward?.id,
              districtId: data?.district?.id,
            });
          },
        };
      },
      []
    );

    const {
      cities,
      districts,
      loading,
      wards,
      fetchCity,
      fetchDistrict,
      fetchWard,
      clearDistrict,
      clearWard,
      updateCity,
      updateDistrict,
      updateWard,
    } = useAddress();

    useEffect(() => {
      if (queryDistrict?.parentCode) {
        fetchDistrict(queryDistrict);
      }
    }, [queryDistrict]);

    useEffect(() => {
      if (queryWard?.parentCode) {
        fetchWard(queryWard);
      }
    }, [queryWard]);

    useEffect(() => {
      fetchCity();
    }, []);

    const handleChangeCity = (cityId: number) => {
      form.resetFields(["wardId", "districtId"]);
      if (cityId) {
        const code = cities.find((e) => e.id == cityId)?.code;
        setQueryDistrict({ parentCode: code });
      } else {
        clearDistrict();
      }
    };

    const handleChangeDistrict = (districtId: number) => {
      form.resetFields(["wardId"]);
      if (districtId) {
        const parentCode = districts.find((e) => e.id == districtId)?.code;
        setQueryWard({ parentCode });
      } else {
        clearWard();
      }
    };

    const handleSubmitAddress = (value: number) => {
      if (value) {
        const { districtId, cityId, wardId } = form.getFieldsValue();
        const data: AddressData = {
          district: districts.find((e) => e.id == districtId),
          ward: wards.find((e) => e.id == wardId),
          city: cities.find((e) => e.id == cityId),
        };
        onChange(data);
      } else {
        onChange(undefined);
      }
    };

    return (
      <>
        <FormItem rules={rules} required label="Tỉnh/Thành phố" name={"cityId"}>
          <Select
            onChange={handleChangeCity}
            style={{ width: "100%" }}
            onClear={() => {
              clearDistrict();
              clearWard();
            }}
            allowClear
            placeholder="Nhập tên tỉnh/thành phố"
            showSearch
            filterOption={(input, option) =>
              option?.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {cities?.map((item) => (
              <Select.Option value={item.id} key={item.id}>
                {item.nameWithType}
              </Select.Option>
            ))}
          </Select>
        </FormItem>
        <FormItem rules={rules} required label="Quận/Huyện" name={"districtId"}>
          <Select
            disabled={!districts.length}
            onClear={clearWard}
            onChange={handleChangeDistrict}
            style={{ width: "100%" }}
            allowClear
            placeholder="Nhập tên Quận/Huyện"
            showSearch
            filterOption={(input, option) =>
              option?.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {districts?.map((item) => (
              <Select.Option value={item.id} key={item.id}>
                {item.nameWithType}
              </Select.Option>
            ))}
          </Select>
        </FormItem>
        <FormItem rules={rules} required label="Xã/Phường" name={"wardId"}>
          <Select
            disabled={!wards.length}
            style={{ width: "100%" }}
            allowClear
            onChange={handleSubmitAddress}
            placeholder="Nhập tên Xã/Thị trấn"
            showSearch
            filterOption={(input, option) =>
              option?.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {wards?.map((item) => (
              <Select.Option value={item.id} key={item.id}>
                {item.nameWithType}
              </Select.Option>
            ))}
          </Select>
        </FormItem>

        {/* </Form> */}
      </>
    );
  }
);
